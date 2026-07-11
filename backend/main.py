from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from database import engine, Base
from routes import interactions, chat, auth, complaints

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-First CRM - HCP Module",
    description="Log Interaction Screen with LangGraph AI Agent",
    version="1.0.0"
)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interactions.router)
app.include_router(chat.router)
app.include_router(auth.router)
app.include_router(complaints.router)

@app.get("/")
def root():
    return {"message": "AI-First CRM HCP Module API", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy"}
