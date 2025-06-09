import React, { useState } from "react";
import axios from "axios";
import "./PredictCrop.css";
import { useLanguage } from "../context/LanguageContext";
import FarmerNavBar from "./FarmerNavBar";
import LanguageSelector from "./LanguageSelector";

const translations = {
  en: {
    title: "🌾 Crop Health Prediction",
    description: "Upload an image of your crop to detect potential diseases and receive expert recommendations.",
    chooseImage: "📷 Choose an Image",
    predictBtn: "🔍 Predict",
    healthy: "✅ Your crop looks healthy! Keep maintaining proper care.",
    error: "Error predicting the image",
    alert: "Please select an image first!",
    prediction: "Prediction",
    confidence: "Confidence",
    possibleDisease: "⚠️ Possible Disease",
    recommendation: "💡 Recommendation"
  },
  mr: {
    title: "🌾 पिक आरोग्य भाकीत",
    description: "आपल्या पिकाचे छायाचित्र अपलोड करा, संभाव्य आजार ओळखा आणि तज्ज्ञांच्या शिफारसी मिळवा.",
    chooseImage: "📷 छायाचित्र निवडा",
    predictBtn: "🔍 भाकीत करा",
    healthy: "✅ आपले पीक आरोग्यदायक दिसत आहे! अशीच काळजी घेत राहा.",
    error: "प्रतिमा भाकीत करताना त्रुटी आली",
    alert: "कृपया प्रथम छायाचित्र निवडा!",
    prediction: "भाकीत",
    confidence: "विश्वास",
    possibleDisease: "⚠️ संभाव्य आजार",
    recommendation: "💡 शिफारस"
  },
  hi: {
    title: "🌾 फसल स्वास्थ्य पूर्वानुमान",
    description: "अपनी फसल की छवि अपलोड करें ताकि संभावित बीमारियों का पता लगाया जा सके और विशेषज्ञ सुझाव मिलें।",
    chooseImage: "📷 छवि चुनें",
    predictBtn: "🔍 पूर्वानुमान करें",
    healthy: "✅ आपकी फसल स्वस्थ दिख रही है! इसी तरह देखभाल करते रहें।",
    error: "छवि का पूर्वानुमान करने में त्रुटि",
    alert: "कृपया पहले कोई छवि चुनें!",
    prediction: "पूर्वानुमान",
    confidence: "विश्वास",
    possibleDisease: "⚠️ संभावित बीमारी",
    recommendation: "💡 सिफारिश"
  }
};

const PredictCrop = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [diseaseInfo, setDiseaseInfo] = useState("");
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

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
      alert(t.alert);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { prediction, confidence, disease, recommendation } = response.data;
      setPrediction(`${t.prediction}: ${prediction} (${t.confidence}: ${confidence.toFixed(2)})`);

      if (prediction.toLowerCase() !== "healthy") {
        setDiseaseInfo(`${t.possibleDisease}: ${disease}\n${t.recommendation}: ${recommendation}`);
      } else {
        setDiseaseInfo(t.healthy);
      }

    } catch (error) {
      console.error("🚨 Upload Error:", error.response?.data || error.message);
      setPrediction(t.error);
      setDiseaseInfo("");
    }
  };

  return (
    <div>
        <FarmerNavBar></FarmerNavBar>
        <LanguageSelector/>

    <div className="predict-crop-container">

      <div className="predict-card">
        <h1>{t.title}</h1>
        <p className="description">{t.description}</p>

        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

        <label className="file-label">
          <input type="file" accept="image/*" className="file-input" onChange={handleFileChange} />
          {t.chooseImage}
        </label>

        <button className="predict-btn" onClick={handleUpload}>
          {t.predictBtn}
        </button>

        {prediction && <p className="prediction-result">{prediction}</p>}
        {diseaseInfo && <p className="disease-info">{diseaseInfo}</p>}
      </div>
    </div>
    </div>
  );
};

export default PredictCrop;
