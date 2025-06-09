import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"  # Disable GPU before importing TF

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np

app = Flask(__name__)
CORS(app)  # ✅ Allow frontend access

# Load the trained model
MODEL_PATH = "fresh_rotten_classifier.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Define target image size (must match training input size)
IMAGE_SIZE = (150, 150)

# Ensure the "uploads" directory exists
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=IMAGE_SIZE)
    img_array = image.img_to_array(img) / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)  # Expand dims to match model input shape
    return img_array

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        print("🚨 No file received!")
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    
    file.save(file_path)
    print(f"✅ File saved at: {file_path}")

    img_array = preprocess_image(file_path)
    predictions = model.predict(img_array)

    class_labels = ["Healthy", "Rotten"]  # Adjust if different
    predicted_label = class_labels[np.argmax(predictions)]

    os.remove(file_path)
    print("🗑️ File deleted after processing")

    return jsonify({"prediction": predicted_label, "confidence": float(np.max(predictions))})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
