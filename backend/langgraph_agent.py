from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, Sequence, Optional, Dict, Any
from langgraph.graph.message import add_messages
import json
from datetime import datetime
from database import SessionLocal
from models import Interaction, ChatMessage
from config import GROQ_API_KEY, LLM_MODEL


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


@tool
def log_interaction_tool(query: str) -> str:
    """Log a new HCP interaction. Use this when the user wants to record a call, meeting, email, visit, or conference with a healthcare professional. Extract doctor name, hospital, specialty, topics, and sentiment from the message."""
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
        
        response = llm.invoke([HumanMessage(content=summary_prompt)])
        
        try:
            extracted = json.loads(response.content)
        except json.JSONDecodeError:
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
            interaction_type=extracted.get("interaction_type", "call"),
            interaction_date=datetime.now(),
            notes=query,
            summary=extracted.get("summary"),
            sentiment=extracted.get("sentiment"),
            key_topics=extracted.get("key_topics"),
            follow_up_required=follow_up_bool
        )
        
        db.add(interaction)
        db.commit()
        db.refresh(interaction)
        
        return json.dumps({
            "status": "success",
            "interaction_id": interaction.id,
            "message": f"Interaction logged successfully with ID {interaction.id}",
            "extracted_data": extracted
        })
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()


@tool
def edit_interaction_tool(query: str) -> str:
    """Edit an existing interaction record. Use this when the user wants to modify, update, or change details of a previously logged interaction. Provide the interaction ID and the fields to update."""
    db = SessionLocal()
    try:
        extract_prompt = f"""Extract from this message:
        - interaction_id (the ID number to edit)
        - updates (dict of field:value pairs to change)
        
        Allowed fields: hcp_name, hcp_email, hcp_specialty, hcp_organization, 
        interaction_type, interaction_date, notes, summary, sentiment, 
        key_topics, follow_up_required, follow_up_date
        
        Message: {query}
        
        Return ONLY valid JSON with keys: interaction_id, updates"""
        
        response = llm.invoke([HumanMessage(content=extract_prompt)])
        
        try:
            edit_data = json.loads(response.content)
        except json.JSONDecodeError:
            return json.dumps({"status": "error", "message": "Could not parse edit request"})
        
        interaction_id = edit_data.get("interaction_id")
        updates = edit_data.get("updates", {})
        
        safe_updates = {k: v for k, v in updates.items() if k in ALLOWED_EDIT_FIELDS}
        
        interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        
        if interaction:
            for key, value in safe_updates.items():
                setattr(interaction, key, value)
            db.commit()
            db.refresh(interaction)
            return json.dumps({
                "status": "success",
                "message": f"Interaction {interaction_id} updated. Fields changed: {list(safe_updates.keys())}"
            })
        else:
            return json.dumps({"status": "error", "message": f"Interaction {interaction_id} not found"})
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()


@tool
def search_interactions_tool(query: str) -> str:
    """Search for existing HCP interactions by doctor name or keywords. Use this when the user wants to find, look up, or search for past interactions."""
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
        
        results = [{
            "id": i.id,
            "hcp_name": i.hcp_name,
            "type": i.interaction_type,
            "date": str(i.interaction_date),
            "summary": i.summary
        } for i in interactions]
        
        return json.dumps({
            "status": "success",
            "count": len(results),
            "results": results
        })
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
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
        
        response = llm.invoke([HumanMessage(content=profile_prompt)])
        
        try:
            data = json.loads(response.content)
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
    
    system_msg = SystemMessage(content="""You are an AI CRM assistant for healthcare professional interactions in the life sciences industry.

You have access to these tools:
1. log_interaction_tool: Log a new HCP interaction (call, meeting, email, visit, conference)
2. edit_interaction_tool: Modify an existing interaction record
3. search_interactions_tool: Search for past interactions by doctor name or keywords
4. get_hcp_profile_tool: Get comprehensive HCP profile with interaction history
5. get_analytics_tool: Get analytics and insights on all interactions

Based on the user's request, use the appropriate tool. Always use a tool when the user asks to log, edit, search, get profile, or get analytics.
If the user just says hello or asks a general question, respond helpfully without using a tool.
""")
    
    all_messages = [system_msg] + list(messages)
    response = llm.bind_tools(tools).invoke(all_messages)
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
    finally:
        db.close()
    
    inputs = {
        "messages": [HumanMessage(content=message)],
        "session_id": session_id,
        "tool_results": [],
        "extracted_data": None
    }
    
    try:
        result = app.invoke(inputs, {"recursion_limit": 5})
    except Exception as e:
        import traceback
        print(f"LANGGRAPH ERROR: {traceback.format_exc()}")
        return {
            "response": f"Error: {str(e)[:200]}",
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
            
            summary_prompt = f"""Based on this tool execution, write a brief response to the user.
Tool: {tool_name}
Result: {json.dumps(tool_result)[:500]}
Write 1-2 sentences confirming what was done."""
            
            summary_response = llm.invoke([HumanMessage(content=summary_prompt)])
            ai_response = summary_response.content
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
    finally:
        db.close()
    
    return {
        "response": ai_response,
        "session_id": session_id,
        "tool_used": tool_used,
        "extracted_data": extracted_data
    }
