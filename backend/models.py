from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Index
from sqlalchemy.sql import func
from database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255), nullable=False, index=True)
    hcp_email = Column(String(255))
    hcp_specialty = Column(String(255))
    hcp_organization = Column(String(255))
    interaction_type = Column(String(20), nullable=False, index=True)
    interaction_date = Column(DateTime, nullable=False, index=True)
    notes = Column(Text, nullable=False)
    summary = Column(Text)
    sentiment = Column(String(50))
    key_topics = Column(Text)
    follow_up_required = Column(Boolean, default=False)
    follow_up_date = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        Index('idx_hcp_name_date', 'hcp_name', 'interaction_date'),
    )

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), nullable=False, index=True)
    role = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
