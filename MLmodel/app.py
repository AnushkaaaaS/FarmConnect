from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os

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
    if "file" not in request.files:  # ✅ Fix key mismatch
        print("🚨 No file received!")  # Debugging
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]  # ✅ Match frontend key
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    
    # Save the image
    file.save(file_path)  
    print(f"✅ File saved at: {file_path}")  # Debugging

    # Preprocess and predict
    img_array = preprocess_image(file_path)
    predictions = model.predict(img_array)

    # Get class labels
    class_labels = ["Healthy", "Rotten"]  # Adjust according to dataset labels
    predicted_label = class_labels[np.argmax(predictions)]

    # Clean up uploaded file
    os.remove(file_path)
    print("🗑️ File deleted after processing")  # Debugging

    return jsonify({"prediction": predicted_label, "confidence": float(np.max(predictions))})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)  # ✅ Enable debug mode for logs
