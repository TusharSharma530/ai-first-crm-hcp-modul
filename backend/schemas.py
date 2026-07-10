from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum


class InteractionTypeSchema(str, Enum):
    CALL = "call"
    MEETING = "meeting"
    EMAIL = "email"
    VISIT = "visit"
    CONFERENCE = "conference"


class InteractionCreate(BaseModel):
    hcp_name: str
    hcp_email: Optional[str] = None
    hcp_specialty: Optional[str] = None
    hcp_organization: Optional[str] = None
    interaction_type: InteractionTypeSchema
    interaction_date: str
    notes: str
    follow_up_required: Optional[str] = "no"
    follow_up_date: Optional[str] = None

    @field_validator("interaction_date", mode="before")
    @classmethod
    def validate_interaction_date(cls, v):
        return str(v) if v else datetime.now().isoformat()

    @field_validator("follow_up_date", mode="before")
    @classmethod
    def validate_follow_up_date(cls, v):
        if v is None or v == "":
            return None
        return str(v)


class InteractionUpdate(BaseModel):
    hcp_name: Optional[str] = None
    hcp_email: Optional[str] = None
    hcp_specialty: Optional[str] = None
    hcp_organization: Optional[str] = None
    interaction_type: Optional[InteractionTypeSchema] = None
    interaction_date: Optional[str] = None
    notes: Optional[str] = None
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    key_topics: Optional[str] = None
    follow_up_required: Optional[str] = None
    follow_up_date: Optional[str] = None


class InteractionResponse(BaseModel):
    id: int
    hcp_name: str
    hcp_email: Optional[str]
    hcp_specialty: Optional[str]
    hcp_organization: Optional[str]
    interaction_type: str
    interaction_date: datetime
    notes: str
    summary: Optional[str]
    sentiment: Optional[str]
    key_topics: Optional[str]
    follow_up_required: Optional[bool]
    follow_up_date: Optional[datetime]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    session_id: str
    tool_used: Optional[str] = None
    extracted_data: Optional[dict] = None
