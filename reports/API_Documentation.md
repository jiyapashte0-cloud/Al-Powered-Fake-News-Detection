# API Documentation

## Base URL

Backend:
https://al-powered-fake-news-detection-2.onrender.com/

---

## POST /api/chat

### Description

Receives a news article from the frontend and returns whether it is likely Real or Fake.

### Request

```json
{
  "prompt": "Paste news article here"
}
```

### Response

```json
{
  "prediction": "REAL NEWS"
}
```

---

## GET /api/history

### Description

Returns the conversation history stored by the backend.

### Response

```json
[
  {
    "question": "...",
    "answer": "..."
  }
]
```