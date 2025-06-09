import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import farmerRegisterBackground from '../assets/farmerpagebck.jpg';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const translations = {
  en: {
    title: "Farmer Registration",
    basicInfo: "Basic Information",
    farmerDetails: "Farmer Details",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    location: "Location",
    totalArea: "Total Area (in acres)",
    areaUnderCultivation: "Area Under Cultivation (in acres)",
    cropCycle: "Crop Cycle",
    agricultureMethod: "Agriculture Method",
    registerButton: "Register",
    registeringText: "Registering...",
    successMessage: "Registration successful!",
    passwordMismatch: "Passwords do not match",
    invalidEmail: "Invalid email address",
    generalError: "An error occurred. Please try again."
  },
  mr: {
    title: "शेतकरी नोंदणी",
    basicInfo: "मूलभूत माहिती",
    farmerDetails: "शेतकरी तपशील",
    firstName: "पहिले नाव",
    lastName: "आडनाव",
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्डची पुष्टी करा",
    location: "स्थान",
    totalArea: "एकूण क्षेत्र (एकर)",
    areaUnderCultivation: "लागवडीखालील क्षेत्र (एकर)",
    cropCycle: "पीक चक्र",
    agricultureMethod: "शेती पद्धत",
    registerButton: "नोंदणी करा",
    registeringText: "नोंदणी होत आहे...",
    successMessage: "नोंदणी यशस्वी!",
    passwordMismatch: "पासवर्ड जुळत नाहीत",
    invalidEmail: "अवैध ईमेल पत्ता",
    generalError: "एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा."
  },
  hi: {
    title: "किसान पंजीकरण",
    basicInfo: "मूलभूत जानकारी",
    farmerDetails: "किसान विवरण",
    firstName: "पहला नाम",
    lastName: "उपनाम",
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    location: "स्थान",
    totalArea: "कुल क्षेत्र (एकड़)",
    areaUnderCultivation: "खेती के तहत क्षेत्र (एकड़)",
    cropCycle: "फसल चक्र",
    agricultureMethod: "कृषि पद्धति",
    registerButton: "पंजीकरण करें",
    registeringText: "पंजीकरण हो रहा है...",
    successMessage: "पंजीकरण सफल!",
    passwordMismatch: "पासवर्ड मेल नहीं खाते",
    invalidEmail: "अमान्य ईमेल पता",
    generalError: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।"
  }
};

const FarmerRegister = () => {
  const [basicInfo, setBasicInfo] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [farmerDetails, setFarmerDetails] = useState({ location: '', totalArea: '', areaUnderCultivation: '', cropCycle: '', agricultureMethod: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const handleInputChange = (e, setFunc, field) => {
    setFunc((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const { password, confirmPassword, email, firstName, lastName } = basicInfo;
  
    if (password !== confirmPassword) {
      setErrorMessage(t.passwordMismatch);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage(t.invalidEmail);
      return;
    }
  
    setErrorMessage('');
    setLoading(true);
  
    try {
      const response = await fetch('https://farmconnect-by0t.onrender.com/api/farmer-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          farmerDetails,
        }),
      });
  
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.message);
      } else {
        toast.success(t.successMessage, { position: 'top-center', autoClose: 3000 });
        localStorage.setItem('farmer', JSON.stringify({ firstName, lastName, email }));
        setTimeout(() => navigate('/farmer-login'), 2000);
      }
    } catch (error) {
      setErrorMessage(t.generalError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: `url(${farmerRegisterBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <LanguageSelector />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '5px',
        padding: '200px 250px',
        borderRadius: '10px',
      }}>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <h2 style={{
            fontSize: '32px',
            fontFamily: 'Cooper Black',
            color: '#333',
            marginBottom: '15px',
            textAlign:'center'
          }}>{t.title}</h2>
          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>{t.basicInfo}</h3>
              <input type="text" placeholder={t.firstName} value={basicInfo.firstName} onChange={(e) => handleInputChange(e, setBasicInfo, 'firstName')} required style={inputStyle} />
              <input type="text" placeholder={t.lastName} value={basicInfo.lastName} onChange={(e) => handleInputChange(e, setBasicInfo, 'lastName')} required style={inputStyle} />
              <input type="email" placeholder={t.email} value={basicInfo.email} onChange={(e) => handleInputChange(e, setBasicInfo, 'email')} required style={inputStyle} />
              <input type="password" placeholder={t.password} value={basicInfo.password} onChange={(e) => handleInputChange(e, setBasicInfo, 'password')} required style={inputStyle} />
              <input type="password" placeholder={t.confirmPassword} value={basicInfo.confirmPassword} onChange={(e) => handleInputChange(e, setBasicInfo, 'confirmPassword')} required style={inputStyle} />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>{t.farmerDetails}</h3>
              <input type="text" placeholder={t.location} value={farmerDetails.location} onChange={(e) => handleInputChange(e, setFarmerDetails, 'location')} required style={inputStyle} />
              <input type="number" placeholder={t.totalArea} value={farmerDetails.totalArea} onChange={(e) => handleInputChange(e, setFarmerDetails, 'totalArea')} required style={inputStyle} />
              <input type="number" placeholder={t.areaUnderCultivation} value={farmerDetails.areaUnderCultivation} onChange={(e) => handleInputChange(e, setFarmerDetails, 'areaUnderCultivation')} required style={inputStyle} />
              <input type="text" placeholder={t.cropCycle} value={farmerDetails.cropCycle} onChange={(e) => handleInputChange(e, setFarmerDetails, 'cropCycle')} required style={inputStyle} />
              <input type="text" placeholder={t.agricultureMethod} value={farmerDetails.agricultureMethod} onChange={(e) => handleInputChange(e, setFarmerDetails, 'agricultureMethod')} required style={inputStyle} />
            </div>
          </div>

          {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? t.registeringText : t.registerButton}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

const inputStyle = {
  margin: '10px 0',
  padding: '10px',
  width: '70%',
  borderRadius: '5px',
  border: '1px solid #ccc',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
};

const buttonStyle = {
  marginTop: '20px',
  width: '50%',
  padding: '12px',
  fontSize: '18px',
  backgroundColor: '#38a169',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

export default FarmerRegister;
