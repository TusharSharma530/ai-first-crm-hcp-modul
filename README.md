# AI-First CRM - HCP Module (Log Interaction Screen)

![Project Screenshot](images/project-foto.png)

A full-stack AI-powered CRM system for Healthcare Professional (HCP) interactions, featuring a LangGraph AI agent with 5 specialized tools for managing sales activities.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Redux |
| Backend | Python + FastAPI |
| AI Agent | LangGraph |
| LLM | Groq (llama-3.3-70b-versatile) |
| Database | MySQL |
| Font | Google Inter |

## Features

![All Records Page](images/all-record.png)

![Documentation Page](images/docs-page.png)

- **Dual Interface**: Structured form OR conversational AI chat to log interactions
- **AI-Powered**: Automatic summarization, sentiment analysis, and entity extraction
- **5 LangGraph Tools**: Log, Edit, Search, Profile, and Analytics
- **Real-time Processing**: Instant feedback and data extraction

## Project Structure

```
assesment/
├── backend/
│   ├── main.py                 # FastAPI application entry
│   ├── config.py               # Configuration (DB, API keys, LLM model)
│   ├── database.py             # SQLAlchemy database connection
│   ├── models.py               # Database models (Interaction, ChatMessage)
│   ├── schemas.py              # Pydantic validation schemas
│   ├── langgraph_agent.py      # LangGraph AI agent with 5 tools
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   └── routes/
│       ├── __init__.py         # Route imports
│       ├── interactions.py     # CRUD API endpoints
│       └── chat.py             # AI chat endpoints
│
├── frontend/
│   ├── index.html              # HTML entry point
│   ├── package.json            # NPM dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── netlify.toml            # Deployment config
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Router setup
│       ├── index.css           # Global styles
│       ├── store/
│       │   └── index.js        # Redux store configuration
│       ├── components/
│       │   └── Layout.jsx      # Navigation bar
│       └── features/
│           ├── interactions/
│           │   ├── LogInteractionForm.jsx   # Structured form
│           │   ├── InteractionsPage.jsx     # All records list
│           │   └── interactionSlice.js      # Redux slice
│           ├── chat/
│           │   ├── ChatInterface.jsx        # AI chat UI
│           │   └── chatSlice.js             # Redux slice
│           └── docs/
│               └── DocsPage.jsx             # Documentation page
│
├── images/
│   ├── project-foto.png        # Homepage screenshot
│   ├── all-record.png          # All records screenshot
│   └── docs-page.png           # Documentation screenshot
│
└── README.md
```

## LangGraph Agent Tools

| Tool | Description |
|------|-------------|
| **Log Interaction** | Captures HCP interaction data with LLM-powered summarization and entity extraction |
| **Edit Interaction** | Modifies existing interaction records using natural language commands |
| **Search Interactions** | Finds interactions by HCP name, date range, or keywords |
| **Get HCP Profile** | Retrieves comprehensive HCP information and interaction history |
| **Analytics** | Provides insights on interaction patterns, sentiment, and top HCPs |

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL database
- Groq API key (https://console.groq.com)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file:
   ```
   DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/crm_hcp
   GROQ_API_KEY=your_groq_api_key_here
   ```

5. Create database:
   ```sql
   CREATE DATABASE crm_hcp;
   ```

6. Start the backend:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## API Documentation

Once running, visit http://localhost:8000/docs for interactive API documentation.

### Key Endpoints

- `GET /api/interactions/` - List all interactions
- `POST /api/interactions/` - Create new interaction
- `PUT /api/interactions/{id}` - Update interaction
- `DELETE /api/interactions/{id}` - Delete interaction
- `POST /api/chat/` - Send message to AI agent

## Usage Examples

### Via Form Interface
1. Navigate to the home page
2. Fill in the HCP details and interaction notes
3. Click "Log Interaction"

### Via AI Chat
1. Navigate to the AI Chat page
2. Type: "Log a call with Dr. Smith about the new medication trial"
3. The AI will extract entities and create the interaction

### Example Chat Commands
- "Log a meeting with Dr. Johnson from City Hospital"
- "Search for interactions with Dr. Smith"
- "Show me analytics on my interactions"
- "Get profile for Dr. Williams"

## Design Decisions

1. **LangGraph**: Used for stateful, multi-step AI reasoning with tool integration
2. **Groq + llama-3.3-70b-versatile**: Fast inference for real-time interaction processing
3. **Dual Interface**: Form for structured data entry, chat for natural language flexibility
4. **MySQL**: Robust relational database for interaction history
5. **Redux**: Centralized state management for React frontend

## License

MIT
