from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, Sequence, Optional, Dict, Any
from langgraph.graph.message import add_messages
import json
import logging
from datetime import datetime
from database import SessionLocal
from models import Interaction, ChatMessage
from config import GROQ_API_KEY, LLM_MODEL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    messages: Annotated[Sequence[HumanMessage | AIMessage], add_messages]
    session_id: str
    tool_results: list
    extracted_data: Optional[Dict[str, Any]]


llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name=LLM_MODEL,
    temperature=0.3
)

ALLOWED_EDIT_FIELDS = {
    "hcp_name", "hcp_email", "hcp_specialty", "hcp_organization",
    "interaction_type", "interaction_date", "notes", "summary",
    "sentiment", "key_topics", "follow_up_required", "follow_up_date"
}


def clean_json_response(response_content: str) -> dict:
    """Clean LLM response and extract valid JSON."""
    import re
    content = response_content.strip()
    content = re.sub(r'^```json\s*', '', content)
    content = re.sub(r'^```\s*', '', content)
    content = re.sub(r'\s*```$', '', content)
    content = content.strip()
    return json.loads(content)


@tool
def log_interaction_tool(query: str) -> str:
    """Log a new HCP interaction. Use this when the user wants to record a call, meeting, email, visit, or conference with a healthcare professional. Extract doctor name, hospital, specialty, topics, and sentiment from the message."""
    if not query or not query.strip():
        return json.dumps({"status": "error", "message": "Please provide interaction details"})
    
    db = SessionLocal()
    try:
        summary_prompt = f"""Extract the following from this interaction note and return ONLY valid JSON:
        - hcp_name (the doctor's name)
        - hcp_specialty (their medical specialty)
        - hcp_organization (hospital/clinic name)
        - hcp_email (email if mentioned)
        - interaction_type (call/meeting/email/visit/conference)
        - key_topics (main topics discussed)
        - sentiment (positive/neutral/negative)
        - follow_up_required (yes/no)
        - follow_up_date (date if mentioned, format: YYYY-MM-DDTHH:MM:SS)
        - summary (brief summary of the interaction)
        
        Note: {query}"""
        
        try:
            response = llm.invoke([HumanMessage(content=summary_prompt)])
        except Exception as e:
            error_str = str(e).lower()
            if "rate_limit" in error_str or "429" in error_str:
                return json.dumps({"status": "error", "message": "AI service busy. Please wait a moment and try again."})
            raise e
        
        try:
            extracted = clean_json_response(response.content)
        except json.JSONDecodeError as e:
            logger.warning(f"JSON parse failed, using fallback: {e}")
            extracted = {
                "hcp_name": "Unknown",
                "interaction_type": "call",
                "summary": query[:200]
            }
        
        follow_up_val = extracted.get("follow_up_required", "no")
        follow_up_bool = follow_up_val.lower() in ("yes", "true", "1") if isinstance(follow_up_val, str) else bool(follow_up_val)
        
        interaction = Interaction(
            hcp_name=extracted.get("hcp_name", "Unknown"),
            hcp_email=extracted.get("hcp_email"),
            hcp_specialty=extracted.get("hcp_specialty"),
            hcp_organization=extracted.get("hcp_organization"),
            interaction_type=extracted.get("interaction_type") or "call",
            interaction_date=datetime.now(),
            notes=query,
            summary=extracted.get("summary") or query[:200],
            sentiment=extracted.get("sentiment") or "neutral",
            key_topics=extracted.get("key_topics"),
            follow_up_required=follow_up_bool
        )
        
        db.add(interaction)
        db.commit()
        db.refresh(interaction)
        
        logger.info(f"Interaction logged: ID={interaction.id}, Name={interaction.hcp_name}")
        return json.dumps({
            "status": "success",
            "interaction_id": interaction.id,
            "message": f"Interaction logged successfully with ID {interaction.id}",
            "extracted_data": extracted
        })
    except Exception as e:
        logger.error(f"Log interaction error: {str(e)}")
        return json.dumps({"status": "error", "message": f"Failed to log interaction: {str(e)[:100]}"})
    finally:
        db.close()


@tool
def edit_interaction_tool(query: str) -> str:
    """Edit an existing interaction record. Use this when the user wants to modify, update, or change details of a previously logged interaction. Can work with just doctor name and field changes - no ID required."""
    if not query or not query.strip():
        return json.dumps({"status": "error", "message": "Please specify what to edit"})
    
    logger.info(f"EDIT TOOL RAW QUERY: {query}")
    db = SessionLocal()
    try:
        import re
        text = query.strip().lower()
        
        interaction_id = None
        id_match = re.search(r'(?:interaction|id|#|no|number)\s*(\d+)', text, re.IGNORECASE)
        if id_match:
            interaction_id = int(id_match.group(1))
        
        hcp_name = None
        name_match = re.search(r'(?:Dr\.?|doctor)\s+([\w]+)', text, re.IGNORECASE)
        if name_match:
            hcp_name = name_match.group(1).strip()
        else:
            name_match2 = re.search(r'(?:name|hcp|doc)\s+(\w+)', text, re.IGNORECASE)
            if name_match2:
                hcp_name = name_match2.group(1).strip()
        
        field_map = {
            "name": "hcp_name", "hcp_name": "hcp_name", "doctor name": "hcp_name", "doc name": "hcp_name",
            "email": "hcp_email", "hcp_email": "hcp_email", "mail": "hcp_email",
            "specialty": "hcp_specialty", "hcp_specialty": "hcp_specialty", "spec": "hcp_specialty",
            "organization": "hcp_organization", "hcp_organization": "hcp_organization", "hospital": "hcp_organization", "org": "hcp_organization", "clinic": "hcp_organization",
            "type": "interaction_type", "interaction_type": "interaction_type", "int type": "interaction_type", "category": "interaction_type",
            "date": "interaction_date", "interaction_date": "interaction_date", "when": "interaction_date",
            "notes": "notes", "note": "notes", "summary": "summary", "desc": "summary", "description": "summary",
            "sentiment": "sentiment", "mood": "sentiment",
            "topics": "key_topics", "key_topics": "key_topics", "topic": "key_topics", "subject": "key_topics",
            "follow up": "follow_up_required", "follow_up_required": "follow_up_required", "followup": "follow_up_required", "follow": "follow_up_required",
            "follow up date": "follow_up_date", "follow_up_date": "follow_up_date", "followup date": "follow_up_date"
        }
        
        updates = {}
        
        name_change = re.search(r'(?:name|hcp|doc)\s+(\w+)\s+(?:to|se|->|=>)\s+(\w+)', text, re.IGNORECASE)
        if name_change:
            updates["hcp_name"] = name_change.group(2)
        
        change_pattern = re.findall(r'(?:change|update|set|modify|alter|edit|edt|replace|correct|karo|badlo|sar|sudharo)\s+(.+?)\s+(?:to|se|->|=>)\s+(.+?)(?:\s+and\s+|\s*$)', text, re.IGNORECASE)
        
        if not change_pattern and not updates:
            hindi_pattern = re.findall(r'(\w+)\s+(?:change|karo|badlo)\s+(?:karo|se|to|->|=>)\s+(.+?)(?:\s+and\s+|\s*$)', text, re.IGNORECASE)
            change_pattern.extend(hindi_pattern)
        
        if not change_pattern and not updates:
            change_pattern = re.findall(r'(\w+)\s+(?:to|se|->|=>)\s+(.+?)(?:\s+and\s+|\s*$)', text, re.IGNORECASE)
        
        for field_raw, value in change_pattern:
            field_raw = field_raw.strip().lower()
            value = value.strip().strip('"').strip("'").rstrip('.')
            
            if not value:
                continue
            
            matched = False
            for key, db_field in field_map.items():
                if key in field_raw:
                    updates[db_field] = value
                    matched = True
                    break
            
            if not matched and field_raw not in ("name", "aryan", "vikas", "dr"):
                for key, db_field in field_map.items():
                    if field_raw == key:
                        updates[db_field] = value
                        break
        
        if not interaction_id and not hcp_name and not updates:
            return json.dumps({
                "status": "error", 
                "message": "Could not understand the edit. Try:\n• 'edit Dr. Smith, change notes to X'\n• 'edit interaction 5, change sentiment to positive'"
            })
        
        logger.info(f"EDIT EXTRACTED - hcp_name: {hcp_name}, interaction_id: {interaction_id}, updates: {updates}")
        
        safe_updates = {k: v for k, v in updates.items() if k in ALLOWED_EDIT_FIELDS}
        logger.info(f"EDIT SAFE_UPDATES: {safe_updates}")
        
        if not safe_updates:
            return json.dumps({"status": "error", "message": f"Could not find a valid field to update. You can change: {', '.join(field_map.keys())}"})
        
        interaction = None
        if interaction_id:
            interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        elif hcp_name:
            interaction = db.query(Interaction).filter(Interaction.hcp_name.ilike(f"%{hcp_name}%")).order_by(Interaction.interaction_date.desc()).first()
        
        if interaction:
            old_values = {}
            for key, value in safe_updates.items():
                old_val = getattr(interaction, key, None)
                old_values[key] = str(old_val) if old_val else "N/A"
                setattr(interaction, key, value)
            db.commit()
            db.refresh(interaction)
            
            changes = []
            for k, v in safe_updates.items():
                changes.append(f"{k}: {old_values.get(k, '?')} → {v}")
            return json.dumps({
                "status": "success",
                "message": f"Interaction #{interaction.id} updated successfully.",
                "interaction_id": interaction.id,
                "changes": changes
            })
        else:
            search_term = hcp_name or f"ID {interaction_id}"
            return json.dumps({"status": "error", "message": f"No interaction found for '{search_term}'. Please log an interaction first or search to find the correct name."})
    except Exception as e:
        logger.error(f"Edit interaction error: {str(e)}")
        return json.dumps({"status": "error", "message": f"Failed to edit: {str(e)[:100]}"})
    finally:
        db.close()


@tool
def search_interactions_tool(query: str) -> str:
    """Search for existing HCP interactions by doctor name or keywords. Use this when the user wants to find, look up, or search for past interactions."""
    if not query or not query.strip():
        return json.dumps({"status": "error", "message": "Please provide a search term"})
    
    db = SessionLocal()
    try:
        import re
        q = db.query(Interaction)

        name_match = re.search(r'(?:Dr\.?|Doctor)\s+([\w\s]+?)(?:\s+keywords?:|\s+and\b|\s*$)', query, re.IGNORECASE)
        if name_match:
            q = q.filter(Interaction.hcp_name.ilike(f"%{name_match.group(1).strip()}%"))
        else:
            words = [w for w in query.split() if w.lower() not in ("search", "interactions", "with", "for", "dr", "dr.", "doctor", "find", "show", "me", "and", "keywords", "keyword", "interaction")]
            if words:
                q = q.filter(Interaction.hcp_name.ilike(f"%{' '.join(words)}%"))
        
        interactions = q.order_by(Interaction.interaction_date.desc()).limit(10).all()
        
        if not interactions:
            return json.dumps({
                "status": "success",
                "count": 0,
                "results": [],
                "message": f"No interactions found for '{query}'"
            })
        
        results = [{
            "id": i.id,
            "hcp_name": i.hcp_name,
            "type": i.interaction_type,
            "date": str(i.interaction_date),
            "summary": i.summary
        } for i in interactions]
        
        logger.info(f"Search '{query}': found {len(results)} results")
        return json.dumps({
            "status": "success",
            "count": len(results),
            "results": results
        })
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        return json.dumps({"status": "error", "message": f"Search failed: {str(e)[:100]}"})
    finally:
        db.close()


@tool
def get_hcp_profile_tool(query: str) -> str:
    """Get a comprehensive profile for a healthcare professional including their interaction history, specialty, and organization. Use this when the user asks about a specific doctor."""
    db = SessionLocal()
    try:
        profile_prompt = f"""Extract the HCP name from this query:
        Query: {query}
        Return ONLY valid JSON with key: hcp_name"""
        
        try:
            response = llm.invoke([HumanMessage(content=profile_prompt)])
        except Exception as e:
            error_str = str(e).lower()
            if "rate_limit" in error_str or "429" in error_str:
                return json.dumps({"status": "error", "message": "AI service busy. Please wait a moment and try again."})
            raise e
        
        try:
            data = clean_json_response(response.content)
        except json.JSONDecodeError:
            data = {"hcp_name": query}
        
        hcp_name = data.get("hcp_name", "")
        
        interactions = db.query(Interaction).filter(
            Interaction.hcp_name.ilike(f"%{hcp_name}%")
        ).order_by(Interaction.interaction_date.desc()).all()
        
        if not interactions:
            return json.dumps({"status": "error", "message": f"No records found for HCP: {hcp_name}"})
        
        latest = interactions[0]
        profile = {
            "name": latest.hcp_name,
            "specialty": latest.hcp_specialty,
            "organization": latest.hcp_organization,
            "email": latest.hcp_email,
            "total_interactions": len(interactions),
            "last_interaction_date": str(latest.interaction_date),
            "recent_topics": latest.key_topics
        }
        
        return json.dumps({"status": "success", "profile": profile})
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()


@tool
def get_analytics_tool(query: str = "") -> str:
    """Get analytics and insights on HCP interactions including total count, type breakdown, sentiment distribution, and top healthcare professionals. Use this when the user wants statistics or insights."""
    db = SessionLocal()
    try:
        from sqlalchemy import func as sqlfunc
        
        total = db.query(Interaction).count()
        
        type_counts = dict(
            db.query(Interaction.interaction_type, sqlfunc.count(Interaction.id))
            .group_by(Interaction.interaction_type)
            .all()
        )
        
        sentiment_counts = dict(
            db.query(Interaction.sentiment, sqlfunc.count(Interaction.id))
            .filter(Interaction.sentiment.isnot(None))
            .group_by(Interaction.sentiment)
            .all()
        )
        
        hcp_counts = dict(
            db.query(Interaction.hcp_name, sqlfunc.count(Interaction.id))
            .group_by(Interaction.hcp_name)
            .order_by(sqlfunc.count(Interaction.id).desc())
            .limit(5)
            .all()
        )
        
        analytics = {
            "total_interactions": total,
            "by_type": type_counts,
            "sentiment_distribution": sentiment_counts,
            "top_hcps": [{"name": h, "interactions": c} for h, c in hcp_counts.items()]
        }
        
        return json.dumps({"status": "success", "analytics": analytics})
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()


tools = [
    log_interaction_tool,
    edit_interaction_tool,
    search_interactions_tool,
    get_hcp_profile_tool,
    get_analytics_tool
]


def call_model(state: AgentState) -> dict:
    messages = state["messages"]
    
    system_msg = SystemMessage(content="""You are an AI CRM assistant. You understand ALL types of user inputs including:
- Misspellings: "log intreaction", "edt interactin", "srearch", "edt", "lod"
- Mixed case: "LOG INTERACTION", "Edit Interaction", "SEARCH dr smith"
- Shortcuts: "log call", "edt notes", "srch smith"
- Natural language: "I want to record a call with Dr. Smith", "can you update Dr. Patel's notes"
- Hindi-English mix: "Dr. Smith ka notes change karo"

Available tools:
1. log_interaction_tool - Record a new interaction with an HCP. Use for: log, record, create, add, new interaction
2. edit_interaction_tool - Modify an existing interaction. Use for: edit, edt, change, update, modify, alter, replace
3. search_interactions_tool - Find past interactions. Use for: search, find, look, show, list, get
4. get_hcp_profile_tool - Get HCP profile and history. Use for: profile, detail, info, about doctor
5. get_analytics_tool - Get statistics. Use for: analytics, stats, report, numbers

IMPORTANT: Always match user intent to the correct tool. Fix spelling automatically. If user says "edt" → edit. If "lod" → log. If "srearch" → search. Never refuse - always try to help.
""")
    
    all_messages = [system_msg] + list(messages)
    try:
        response = llm.bind_tools(tools).invoke(all_messages)
    except Exception as e:
        error_str = str(e).lower()
        if "rate_limit" in error_str or "429" in error_str:
            from langchain_core.messages import AIMessage
            response = AIMessage(content="⏳ AI service is busy right now. Please wait a minute and try again.")
        else:
            raise e
    return {"messages": [response]}


def should_continue(state: AgentState) -> str:
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END


def run_tool(state: AgentState) -> dict:
    last_message = state["messages"][-1]
    results = []
    extracted_data = None
    
    for tool_call in last_message.tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]
        
        tool_map = {t.name: t for t in tools}
        
        tool_func = tool_map.get(tool_name)
        if tool_func:
            if isinstance(tool_args, dict):
                query = tool_args.get("query", str(tool_args))
            else:
                query = str(tool_args)
            result = tool_func.invoke(query)
            results.append({"tool": tool_name, "result": json.loads(result)})
            
            if tool_name == "log_interaction_tool":
                parsed = json.loads(result)
                extracted_data = parsed.get("extracted_data")
    
    import uuid
    tool_result_msg = AIMessage(
        content=f"Tool results: {json.dumps(results)}",
        id=str(uuid.uuid4())
    )
    
    return {
        "messages": [tool_result_msg],
        "tool_results": results,
        "extracted_data": extracted_data
    }


workflow = StateGraph(AgentState)

workflow.add_node("agent", call_model)
workflow.add_node("tools", run_tool)

workflow.set_entry_point("agent")

workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "tools": "tools",
        END: END
    }
)

workflow.add_edge("tools", "agent")

app = workflow.compile()


def process_message(message: str, session_id: str = "default") -> dict:
    if not message or not message.strip():
        return {
            "response": "Please provide a valid message.",
            "session_id": session_id,
            "tool_used": None,
            "extracted_data": None
        }
    
    message = message.strip()[:5000]
    
    db = SessionLocal()
    try:
        db_message = ChatMessage(
            session_id=session_id,
            role="user",
            content=message
        )
        db.add(db_message)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to save user message: {e}")
    finally:
        db.close()
    
    inputs = {
        "messages": [HumanMessage(content=message)],
        "session_id": session_id,
        "tool_results": [],
        "extracted_data": None
    }
    
    try:
        result = app.invoke(inputs, {"recursion_limit": 15})
    except Exception as e:
        logger.error(f"LangGraph error: {str(e)}", exc_info=True)
        error_str = str(e).lower()
        
        if "rate_limit" in error_str or "rate limit" in error_str or "429" in error_str:
            error_msg = "⏳ API rate limit reached. Please wait a minute and try again."
        elif "recursion" in error_str:
            error_msg = "Recursion limit hit. Please try a simpler command."
        elif "api" in error_str or "groq" in error_str or "connection" in error_str:
            error_msg = "AI service is temporarily unavailable. Please try again in a moment."
        elif "timeout" in error_str:
            error_msg = "Request timed out. Please try again."
        else:
            error_msg = f"Error: {str(e)[:200]}"
        
        return {
            "response": error_msg,
            "session_id": session_id,
            "tool_used": None,
            "extracted_data": None
        }
    
    ai_response = ""
    tool_used = None
    extracted_data = None
    
    for msg in reversed(result["messages"]):
        if isinstance(msg, AIMessage) and not msg.tool_calls:
            ai_response = msg.content
            break
    
    if not ai_response or ai_response.startswith("Tool results:"):
        if result.get("tool_results"):
            last_tool = result["tool_results"][-1]
            tool_name = last_tool.get("tool", "")
            tool_result = last_tool.get("result", {})
            
            if tool_result.get("status") == "error":
                ai_response = f"Sorry, {tool_result.get('message', 'something went wrong')}"
            else:
                if tool_name == "edit_interaction_tool" and tool_result.get("changes"):
                    changes_text = "\n".join(f"• {c}" for c in tool_result["changes"])
                    ai_response = f"✅ Interaction #{tool_result.get('interaction_id', '?')} updated:\n{changes_text}"
                elif tool_name == "edit_interaction_tool":
                    ai_response = f"✅ {tool_result.get('message', 'Interaction updated successfully.')}"
                else:
                    summary_prompt = f"""Based on this tool execution, write a brief response to the user.
Tool: {tool_name}
Result: {json.dumps(tool_result)[:500]}
Write 1-2 sentences confirming what was done."""
                    
                    try:
                        summary_response = llm.invoke([HumanMessage(content=summary_prompt)])
                        ai_response = summary_response.content
                    except Exception as e:
                        error_str = str(e).lower()
                        if "rate_limit" in error_str or "429" in error_str:
                            ai_response = f"✅ Done! {tool_result.get('message', 'Operation completed successfully.')}"
                        else:
                            logger.error(f"Summary generation failed: {e}")
                            ai_response = f"Done! {tool_result.get('message', 'Operation completed successfully.')}"
        else:
            ai_response = "I processed your request."
    
    if result.get("tool_results"):
        last_tool = result["tool_results"][-1]
        tool_used = last_tool.get("tool")
        extracted_data = result.get("extracted_data")
    
    db = SessionLocal()
    try:
        db_message = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=ai_response
        )
        db.add(db_message)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to save assistant message: {e}")
    finally:
        db.close()
    
    return {
        "response": ai_response,
        "session_id": session_id,
        "tool_used": tool_used,
        "extracted_data": extracted_data
    }
