# LLMAssignment

Smart Librarian – a small RAG chatbot that recommends books and provides detailed summaries.

## Setup
1. Install dependencies:
   ```bash
   pip install openai chromadb
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

