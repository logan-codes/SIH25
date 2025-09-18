from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import pdfplumber
import docx
import re
import string
from difflib import SequenceMatcher
import spacy

# Load English NLP model
nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Load template
with open("template.txt", "r", encoding="utf-8") as f:
    template_text = f.read()

# Helper: Extract text from file
def extract_text(file_path):
    ext = file_path.split(".")[-1].lower()
    if ext == "pdf":
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text
    elif ext == "docx":
        doc = docx.Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])
    elif ext == "txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    else:
        raise ValueError("Unsupported file type")

# Helper: Compute similarity
def compute_similarity(text1, text2):
    return SequenceMatcher(None, text1, text2).ratio() * 100

# Helper: Extract key features using spaCy NER
def extract_key_features(text):
    doc = nlp(text)
    people = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    dates = [ent.text for ent in doc.ents if ent.label_ == "DATE"]
    places = [ent.text for ent in doc.ents if ent.label_ in ("GPE", "LOC")]

    return {
        "Name": people[0] if people else None,
        "Date": dates[0] if dates else None,
        "Location": places[0] if places else None,
    }

# Endpoint: Match document to template
@app.route("/api/match", methods=["POST"])
def match_document():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    try:
        file_text = extract_text(file_path)
        score = compute_similarity(file_text, template_text)
        key_features = extract_key_features(file_text)
        return jsonify({
            "score": round(score, 2),
            "keyFeatures": key_features
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
