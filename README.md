# LLMAssignment

## Run backend (FastAPI)

1. Ensure dependencies are installed:

```powershell
py -m pip install -r .\requirements.txt
```

2. Start the API (default on http://localhost:8000):

```powershell
py -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

Health check: open http://localhost:8000/health

Endpoints:
- GET /summaries
- GET /summary/{title}
- POST /recommend { query }
- POST /chat { message }

## Run frontend (Expo)

```powershell
cd .\frontend
npm install
npm run start
```

Notes:
- Android emulator uses the host at 10.0.2.2, configured in `frontend/config.js`.
- Web and iOS simulator use http://localhost:8000.

Smart Librarian – a small RAG chatbot that recommends books and provides detailed summaries.

## Setup
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Set the `OPENAI_API_KEY` environment variable.

## Usage
Run the CLI chatbot:
```bash
python smart_librarian.py
```
Type your interests (ex: `Vreau o carte despre prietenie și magie`) and the bot will recommend a book and show a full summary.

## React Native Frontend
A minimal React Native app lives in the `frontend` folder with two screens:
- **Chat** – interact with the chatbot.
- **History** – review the last conversation stored locally.

Run it with Expo:
```bash
cd frontend
npm install
npm start

