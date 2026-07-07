#  AI Powered Fake News Detection

##  Overview

AI Powered Fake News Detection is a machine learning-based web application that predicts whether a news article is likely to be real or fake based on patterns learned from a labeled dataset. The application uses TF-IDF vectorization and a Logistic Regression model to classify user-provided news articles.

The project follows a complete client-server architecture with a responsive frontend, a Flask backend, and a trained machine learning model. Users can enter a news article, receive an instant prediction, and view previous interactions through the conversation history feature.

This project was developed as part of the U2U Internship Program to demonstrate the integration of Machine Learning, Backend Development, Frontend Development, REST APIs, and Deployment.

##  Live Demo

**Frontend:**https://truthlens-app.vercel.app/
**Backend API:** https://al-powered-fake-news-detection-2.onrender.com

## ✨ Features

- Detects whether a news article is likely to be Real or Fake.
- Machine Learning model trained using TF-IDF and Logistic Regression.
- Interactive and responsive user interface.
- Client-server architecture using Flask APIs.
- Stores conversation history of previous predictions.
- Deployed frontend using Vercel.
- Deployed backend using Render.

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Flask (Python)

### Machine Learning
- Scikit-learn
- Pandas
- NumPy
- TF-IDF Vectorizer
- Logistic Regression

### Deployment
- Vercel
- Render

## 📂 Project Structure

```
AI-Powered-Fake-News-Detection/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── model.pkl
│   ├── vectorizer.pkl
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│
├── Fake_news_detection.ipynb
├── cleaned_dataset.csv
├── README.md
└── .gitignore
```

## ⚙️ Installation

### Clone the repository

```bash
git clone <repository-url>
cd AI-Powered-Fake-News-Detection
```

### Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Run the backend

```bash
python app.py
```

### Open the frontend

Open `frontend/index.html` in your browser.

## 📡 API Endpoints

### POST `/api/chat`

**Request**

```json
{
    "prompt": "Paste a news article here"
}
```

**Response**

```json
{
    "prediction": "REAL NEWS"
}
```

---

### GET `/api/history`

Returns the previous predictions made during the session.

## ⚠️ Limitations

- The model is trained on a specific labeled fake news dataset.
- Predictions are based on patterns learned from the training data and may not generalize well to all news articles.
- The application performs best on news articles that are similar in writing style and domain to the training dataset.
- This project is intended for educational and demonstration purposes and should not be used as a definitive fact-checking system.