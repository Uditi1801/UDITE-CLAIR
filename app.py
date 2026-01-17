from flask import Flask, render_template, request, jsonify
import json
import os

from openai import OpenAI
from dotenv import load_dotenv

app = Flask(__name__)

# ---------- ENV + OPENAI ----------
load_dotenv()
client = OpenAI()

# ---------- PATH ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUIZ_FILE = os.path.join(BASE_DIR, "static", "quizzes.json")

# ---------- TOPICS + THEMES ----------
TOPICS = {
    "variables": {"desc": "Learn how variables store and manage data in Python.", "theme": "rose"},
    "if_else": {"desc": "Understand decision making using if and else statements.", "theme": "lavender"},
    "arrays": {"desc": "Work with lists and collections of data.", "theme": "champagne"},
    "loops": {"desc": "Repeat tasks efficiently using loops.", "theme": "sage"},
    "functions": {"desc": "Organize reusable code using functions.", "theme": "midnight"}
}

# ---------- LOAD QUIZ DATA ----------
def load_quizzes():
    with open(QUIZ_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

# ---------- ROUTES ----------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/topics")
def topics():
    return render_template("topics.html", topics=TOPICS)

@app.route("/topic/<topic>")
def topic_detail(topic):
    if topic not in TOPICS:
        return "Topic not found"
    return render_template(
        "topic_detail.html",
        topic=topic,
        description=TOPICS[topic]["desc"]
    )

@app.route("/topic/<topic>/levels")
def level_select(topic):
    if topic not in TOPICS:
        return "Topic not found"
    return render_template(
        "level_select.html",
        topic=topic,
        theme=TOPICS[topic]["theme"]
    )

@app.route("/quiz/<topic>/<level>")
def quiz(topic, level):
    quizzes = load_quizzes()
    if topic not in quizzes or level not in quizzes[topic]:
        return "Quiz not found"

    return render_template(
        "quiz.html",
        topic=topic,
        level=level,
        theme=TOPICS[topic]["theme"],
        questions=quizzes[topic][level]
    )

# ---------- READ PAGES (FIXED, SAME ROUTE) ----------
@app.route("/read/<topic>")
def read(topic):
    # only allow known topics
    if topic not in TOPICS:
        return "Topic not found"

    # load templates/read/<topic>.html
    return render_template(f"read/{topic}.html")

# ---------- U D I V A   C H A T ----------
@app.route("/udiva-chat", methods=["POST"])
def udiva_chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"reply": "Ask me anything."})

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are Udiva, a calm academic assistant. "
                    "Explain concepts in simple, conversational language. "
                    "Do not use markdown, headings, bullet symbols, or formatting characters. "
                    "If code is required, write it as plain text in one short block. "
                    "Explain like a tutor chatting with a student."
                )
            },
            {"role": "user", "content": user_message}
        ]
    )

    return jsonify({"reply": response.choices[0].message.content})

# ---------- RUN ----------
if __name__ == "__main__":
    app.run(debug=True)
