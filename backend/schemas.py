import re
from pydantic import BaseModel, field_validator, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")


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


class UserCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = "user"
    password: str
    confirm_password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        if not EMAIL_REGEX.match(v):
            raise ValueError("Invalid email format")
        return v.lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        return v

    @field_validator("confirm_password")
    @classmethod
    def validate_confirm_password(cls, v, info):
        if info.data.get("password") and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v


class UserLogin(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        return v.lower()


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    role: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    language: str
    timezone: str
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    bio: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    avatar: Optional[str] = None


class ChangePassword(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v):
        return v

    @field_validator("confirm_password")
    @classmethod
    def validate_confirm_password(cls, v, info):
        if info.data.get("new_password") and v != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return v


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenRefresh(BaseModel):
    refresh_token: str


class ComplaintCreate(BaseModel):
    subject: str
    description: Optional[str] = None
    category: str = "bug"
    priority: str = "medium"
    assignee: Optional[str] = None
    reporter_name: Optional[str] = None
    reporter_email: Optional[str] = None


class ComplaintUpdate(BaseModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee: Optional[str] = None


class ComplaintResponse(BaseModel):
    id: int
    subject: str
    description: Optional[str] = None
    category: str
    status: str
    priority: str
    assignee: Optional[str] = None
    reporter_name: Optional[str] = None
    reporter_email: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
