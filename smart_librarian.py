"""CLI chatbot that recommends books using RAG and a summary tool."""

import json
import os
from typing import List, Dict

import chromadb
from chromadb.utils import embedding_functions
from openai import OpenAI

from tools import get_summary_by_title

# Simple offensive language filter
OFFENSIVE_WORDS = {"idiot", "stupid", "dumb"}


def load_summaries(path: str) -> List[Dict[str, str]]:
    """Parse the summaries file into a list of dicts."""
    summaries = []
    current = {}
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("## Title:"):
                if current:
                    summaries.append(current)
                current = {"title": line.replace("## Title: ", "").strip(), "summary": ""}
            elif line:
                current["summary"] += line + " "
        if current:
            summaries.append(current)
    return summaries


def build_vector_store(summaries: List[Dict[str, str]]):
    """Create a ChromaDB collection from the summaries."""
    embedding_fn = embedding_functions.OpenAIEmbeddingFunction(
        api_key=os.environ.get("OPENAI_API_KEY"),
        model_name="text-embedding-3-small",
    )
    client = chromadb.Client()
    collection = client.get_or_create_collection(
        name="books",
        embedding_function=embedding_fn,
    )
    for idx, item in enumerate(summaries):
        collection.add(
            ids=[str(idx)],
            documents=[item["summary"]],
            metadatas=[{"title": item["title"]}],
        )
    return collection


def main() -> None:
    summaries = load_summaries("data/book_summaries.txt")
    collection = build_vector_store(summaries)
    client = OpenAI()

    print("Smart Librarian - scrie 'exit' pentru a ieși")
    while True:
        query = input("Întrebare: ").strip()
        if query.lower() == "exit":
            break
        if any(word in query.lower() for word in OFFENSIVE_WORDS):
            print("Te rog folosește un limbaj adecvat.")
            continue
        results = collection.query(query_texts=[query], n_results=1)
        if not results["documents"]:
            print("Nu am găsit nicio potrivire.")
            continue
        title = results["metadatas"][0][0]["title"]
        context = results["documents"][0][0]

        messages = [
            {
                "role": "system",
                "content": "Ești un bibliotecar prietenos. Recomandă cartea potrivită pe baza contextului furnizat.",
            },
            {"role": "user", "content": query},
            {
                "role": "assistant",
                "content": f"Titlu: {title}\nRezumat: {context}",
            },
        ]

        tools = [
            {
                "type": "function",
                "function": {
                    "name": "get_summary_by_title",
                    "description": "Returnează rezumatul complet al unei cărți după titlu",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"}
                        },
                        "required": ["title"],
                    },
                },
            }
        ]

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=tools,
        )
        msg = response.choices[0].message
        if msg.tool_calls:
            for call in msg.tool_calls:
                if call.function.name == "get_summary_by_title":
                    args = json.loads(call.function.arguments)
                    summary = get_summary_by_title(args.get("title", title))
                    messages.append(msg)
                    messages.append(
                        {
                            "role": "tool",
                            "tool_call_id": call.id,
                            "content": summary,
                        }
                    )
                    follow = client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=messages,
                    )
                    print(follow.choices[0].message.content)
        else:
            print(msg.content)


if __name__ == "__main__":
    main()
