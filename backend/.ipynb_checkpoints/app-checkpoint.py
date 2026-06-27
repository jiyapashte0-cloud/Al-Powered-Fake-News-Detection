from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)

# ----------------------------
# FIXED PATHS (IMPORTANT)
# model.pkl and vectorizer.pkl are OUTSIDE backend folder
# ----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "..", "model.pkl")
vectorizer_path = os.path.join(BASE_DIR, "..", "vectorizer.pkl")

with open(model_path, "rb") as f:
    model = pickle.load(f)

with open(vectorizer_path, "rb") as f:
    vectorizer = pickle.load(f)


# ----------------------------
# In-memory storage
# ----------------------------
history = []
feedback_list = []


# ----------------------------
# HOME
# ----------------------------
@app.route("/")
def home():
    return "Fake News Detection Backend is Running!"


# ----------------------------
# HEALTH CHECK
# ----------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "message": "Backend is running successfully"
    })


# ----------------------------
# MAIN AI ENDPOINT
# ----------------------------
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        text = data.get("text", "")

        vec = vectorizer.transform([text])
        prediction = model.predict(vec)[0]

        result = "REAL NEWS ✅" if prediction == 1 else "FAKE NEWS ❌"

        # save history
        history.append({
            "text": text,
            "prediction": result
        })

        return jsonify({
            "prediction": result
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


# ----------------------------
# HISTORY
# ----------------------------
@app.route("/api/history", methods=["GET"])
def get_history():
    return jsonify(history)


# ----------------------------
# USERS (dummy)
# ----------------------------
@app.route("/api/users", methods=["GET"])
def users():
    return jsonify([
        {"id": 1, "name": "Mrunmayi"}
    ])


# ----------------------------
# FEEDBACK
# ----------------------------
@app.route("/api/feedback", methods=["POST"])
def feedback():
    try:
        data = request.get_json()
        feedback_list.append(data)

        return jsonify({
            "status": "success",
            "message": "Feedback saved"
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


# ----------------------------
# SIMPLE TEST UI (optional)
# ----------------------------
@app.route("/test")
def test():
    return """
    <h2>Fake News Test UI</h2>
    <form action="/predict" method="post">
        <textarea name="text" rows="8" cols="60"></textarea><br><br>
        <button type="submit">Predict</button>
    </form>
    """


@app.route("/predict", methods=["POST"])
def browser_predict():
    text = request.form["text"]

    vec = vectorizer.transform([text])
    prediction = model.predict(vec)[0]

    return f"<h1>{'REAL NEWS ✅' if prediction == 1 else 'FAKE NEWS ❌'}</h1>"


# ----------------------------
# RUN SERVER
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)