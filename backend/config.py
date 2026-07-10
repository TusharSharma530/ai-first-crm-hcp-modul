import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./crm_hcp.db")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
LLM_MODEL = "gemma2-9b-it"
