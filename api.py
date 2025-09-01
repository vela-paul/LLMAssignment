"""
REST API for Smart Librarian using FastAPI.
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import os
import json

from tools import get_summary_by_title
from smart_librarian import SmartLibrarianService, load_summaries

app = FastAPI()

# Allow CORS for development (Expo/mobile/web)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = SmartLibrarianService()
summaries = service.summaries

class QueryRequest(BaseModel):
    query: str

class CoverRequest(BaseModel):
    title: str | None = None
    prompt: str | None = None
    size: str | None = "512x512"

class ResponsesRequest(BaseModel):
    messages: List[Dict[str, str]]

class CreateConversationResponse(BaseModel):
    conversation_id: str

class ConversationMessageRequest(BaseModel):
    conversation_id: str
    message: str

MODEL_NAME = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/summaries", response_model=List[Dict[str, str]])
def get_all_summaries():
    return summaries

@app.get("/summary/{title}")
def get_summary(title: str):
    summary = get_summary_by_title(title)
    if summary.startswith("Rezumat indisponibil"):
        raise HTTPException(status_code=404, detail="Summary not found")
    return {"title": title, "summary": summary}

@app.post("/recommend")
def recommend_books(request: QueryRequest):
    titles = service.recommend(request.query, n=3)
    return {"recommended_titles": titles}

@app.post("/responses")
def responses(req: ResponsesRequest):
    return service.chat_with_history(req.messages)

# Conversations API
@app.post("/conversations", response_model=CreateConversationResponse)
def create_conversation():
    cid = service.create_conversation()
    return {"conversation_id": cid}

@app.get("/conversations/{conversation_id}")
def get_conversation(conversation_id: str):
    return {"messages": service.get_conversation(conversation_id)}

@app.post("/conversations/message")
def post_message(req: ConversationMessageRequest):
    try:
        result = service.add_user_message(req.conversation_id, req.message)
        # Include the conversation_id for clients that wish to store/refresh it
        result["conversation_id"] = req.conversation_id
        return result
    except KeyError:
        # Auto-recover: create a new conversation and handle the message
        new_cid = service.create_conversation()
        result = service.add_user_message(new_cid, req.message)
        result["conversation_id"] = new_cid
        return result


@app.post("/cover")
def cover(req: CoverRequest):
    """Generate or return a placeholder cover image as a data URL.
    Uses a simple SVG fallback so this works without external keys/services.
    """
    title_or_prompt = (req.title or req.prompt or "Book").strip()
    try:
        # For now, return the local placeholder to avoid network dependencies.
        # A fuller implementation could call a service method that uses OpenAI Images when available.
        return {"image_data_url": _placeholder_svg_data_url(title_or_prompt)}
    except Exception:
        # Last-resort fallback
        return {"image_data_url": _placeholder_svg_data_url(title_or_prompt)}


def _placeholder_svg_data_url(title: str) -> str:
    import base64
    safe_title = (title or "Book").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    svg = f"""
    <svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#0b0b0d'/>
          <stop offset='100%' stop-color='#b91c1c'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)' />
      <rect x='32' y='32' width='448' height='448' rx='16' ry='16' fill='none' stroke='#dc2626' stroke-width='4'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#ffffff' font-size='28' font-family='Arial'>
        {safe_title}
      </text>
    </svg>
    """.strip()
    b64 = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{b64}"


