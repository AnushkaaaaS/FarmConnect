import React, { useState } from "react";
import axios from "axios";
import "./PredictCrop.css";

const PredictCrop = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [prediction, setPrediction] = useState("");
    const [diseaseInfo, setDiseaseInfo] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select an image first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { prediction, confidence, disease, recommendation } = response.data;
            setPrediction(`Prediction: ${prediction} (Confidence: ${confidence.toFixed(2)})`);
            
            if (prediction.toLowerCase() !== "healthy") {
                setDiseaseInfo(`⚠️ Possible Disease: ${disease} \n💡 Recommendation: ${recommendation}`);
            } else {
                setDiseaseInfo("✅ Your crop looks healthy! Keep maintaining proper care.");
            }

        } catch (error) {
            console.error("🚨 Upload Error:", error.response?.data || error.message);
            setPrediction("Error predicting the image");
            setDiseaseInfo("");
        }
    };

    return (
        <div className="predict-crop-container">
            <div className="predict-card">
                <h1>🌾 Crop Health Prediction</h1>
                <p className="description">
                    Upload an image of your crop to detect potential diseases and receive expert recommendations.
                </p>

                {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

                <label className="file-label">
                    <input type="file" accept="image/*" className="file-input" onChange={handleFileChange} />
                    📷 Choose an Image
                </label>

                <button className="predict-btn" onClick={handleUpload}>🔍 Predict</button>

                {prediction && <p className="prediction-result">{prediction}</p>}
                {diseaseInfo && <p className="disease-info">{diseaseInfo}</p>}
            </div>
        </div>
    );
};

export default PredictCrop;