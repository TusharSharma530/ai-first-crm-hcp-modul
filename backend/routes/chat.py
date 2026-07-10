from fastapi import APIRouter
from fastapi.responses import JSONResponse
from schemas import ChatRequest, ChatResponse
from langgraph_agent import process_message
import uuid

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        session_id = request.session_id or str(uuid.uuid4())
        
        if not request.message or not request.message.strip():
            return JSONResponse(
                status_code=400,
                content={"detail": "Message cannot be empty"}
            )
        
        result = process_message(request.message, session_id)
        
        return ChatResponse(
            response=result["response"],
            session_id=result["session_id"],
            tool_used=result.get("tool_used"),
            extracted_data=result.get("extracted_data")
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal error: {str(e)[:200]}"}
        )

@router.post("/session/{session_id}")
def get_session_history(session_id: str):
    from database import SessionLocal
    from models import ChatMessage
    
    db = SessionLocal()
    try:
        messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).order_by(ChatMessage.created_at).all()
        
        return [{"role": m.role, "content": m.content, "created_at": str(m.created_at)} for m in messages]
    finally:
        db.close()
