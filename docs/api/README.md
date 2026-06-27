# API Endpoints Documentation

## Objective
Create API endpoints that expose AI functionality for the Fake News Detection system.

## Endpoint Table

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/chat | POST | Send news text to AI model |
| /api/history | GET | Retrieve previous detection history |
| /api/users | GET | Fetch user information |
| /api/feedback | POST | Store user feedback |
| /api/health | GET | Check server health |

## Endpoint Explanation

### /api/chat
Used to send user input to the AI model for fake news detection.

### /api/history
Retrieves previous detection records.

### /api/users
Fetches user information from database.

### /api/feedback
Stores user ratings and feedback.

### /api/health
Checks if server is running properly.
