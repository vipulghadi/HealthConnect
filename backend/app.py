from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import base64
import os
from datetime import datetime
import uuid
import csv

app = Flask(__name__)

CSV_LOG_PATH = "submissions_log.csv"
# Path to your reference image (must be 256x256 and preferably white background, black drawing)
REFERENCE_IMAGE_PATH = "static/reference.png"

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/compare', methods=['POST'])
def compare():
    data_url = request.form['drawnImage']
    header, encoded = data_url.split(",")
    drawn_bytes = base64.b64decode(encoded)

    # Convert to OpenCV image
    nparr = np.frombuffer(drawn_bytes, np.uint8)
    drawn_img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    drawn_img = cv2.resize(drawn_img, (256, 256))
    _, drawn_img = cv2.threshold(drawn_img, 127, 255, cv2.THRESH_BINARY_INV)

    # Load and process reference image
    ref_img = cv2.imread(REFERENCE_IMAGE_PATH, cv2.IMREAD_GRAYSCALE)
    ref_img = cv2.resize(ref_img, (256, 256))
    _, ref_img = cv2.threshold(ref_img, 127, 255, cv2.THRESH_BINARY_INV)

    # Find contours
    contours_ref, _ = cv2.findContours(ref_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours_drawn, _ = cv2.findContours(drawn_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Return 0% if no contours detected
    if not contours_ref or not contours_drawn:
        return jsonify({"match": 0.0})

    # Use largest contour (main shape)
    ref_contour = max(contours_ref, key=cv2.contourArea)
    drawn_contour = max(contours_drawn, key=cv2.contourArea)

    # Compare shapes using Hu Moments
    shape_score = cv2.matchShapes(ref_contour, drawn_contour, cv2.CONTOURS_MATCH_I2, 0.0)

    # Lower score = better match. Invert & scale
    match_score = max(0.0, 100 - shape_score * 100)

    return jsonify({"match": round(match_score, 2)})


@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    image_data = data['image']
    accuracy = data['accuracy']
    auto_submit = data.get('autoSubmit', False)
    time_taken = data.get('timeTaken', 0)

    # Create timestamp and filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    label = "auto" if auto_submit else "manual"
    filename = f"submission_{label}_{int(accuracy)}_{time_taken}s_{timestamp}.png"
    filepath = os.path.join("static", filename)

    # Decode and save the image
    header, encoded = image_data.split(",")
    image_bytes = base64.b64decode(encoded)
    with open(filepath, "wb") as f:
        f.write(image_bytes)

    # Save to CSV
    log_exists = os.path.exists(CSV_LOG_PATH)
    with open(CSV_LOG_PATH, "a", newline="") as csvfile:
        fieldnames = ["timestamp", "accuracy", "time_taken", "submission_type", "filename"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        if not log_exists:
            writer.writeheader()
        writer.writerow({
            "timestamp": timestamp,
            "accuracy": accuracy,
            "time_taken": time_taken,
            "submission_type": label,
            "filename": filename
        })

    return jsonify({
        "message": f"Drawing submitted! Accuracy: {accuracy}%, Time Taken: {time_taken}s"
    })

if __name__ == '__main__':
    app.run(debug=True)
