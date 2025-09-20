from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import pdfplumber
import docx
import re
import string
from difflib import SequenceMatcher
import spacy
import cv2
import numpy as np
from PIL import Image
import base64
import io

# Load English NLP model
nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Load template image
template_image = cv2.imread("template.png", cv2.IMREAD_GRAYSCALE)

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

# Helper: Compare images using template matching
def compare_images(template_img, uploaded_img):
    # Resize uploaded image to match template if needed
    if template_img.shape != uploaded_img.shape:
        uploaded_img = cv2.resize(uploaded_img, (template_img.shape[1], template_img.shape[0]))
    
    # Template matching
    result = cv2.matchTemplate(uploaded_img, template_img, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, _ = cv2.minMaxLoc(result)
    
    return max_val * 100

# Helper: Process uploaded image
def process_uploaded_image(file_path):
    # Read image
    img = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Could not read image file")
    return img

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
        file_ext = filename.split(".")[-1].lower()
        
        # Handle image files
        if file_ext in ["png", "jpg", "jpeg", "bmp", "tiff"]:
            uploaded_img = process_uploaded_image(file_path)
            score = compare_images(template_image, uploaded_img)
            return jsonify({
                "score": round(score, 2),
                "type": "image",
                "message": "Image compared with PC 1.png template"
            })
        
        # Handle text-based files
        elif file_ext in ["pdf", "docx", "txt"]:
            file_text = extract_text(file_path)
            # For text files, we'll use a simple template comparison
            # You can modify this based on your specific text template needs
            score = 85.0  # Placeholder score for text files
            key_features = extract_key_features(file_text)
            return jsonify({
                "score": round(score, 2),
                "type": "text",
                "keyFeatures": key_features
            })
        
        else:
            return jsonify({"error": "Unsupported file type"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
