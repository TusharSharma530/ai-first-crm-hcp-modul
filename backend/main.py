from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import interactions, chat, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-First CRM - HCP Module",
    description="Log Interaction Screen with LangGraph AI Agent",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interactions.router)
app.include_router(chat.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "AI-First CRM HCP Module API", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy"}
