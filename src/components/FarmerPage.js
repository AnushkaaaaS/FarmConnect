import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import farmerBackground from '../assets/farmerpagebck.jpg'; // Ensure correct path

const translations = {
  en: {
    welcome: "Welcome Farmers!",
    loginButton: "Farmer Login",
    registerButton: "Farmer Register"
  },
  mr: {
    welcome: "शेतकऱ्यांनो स्वागत आहे!",
    loginButton: "शेतकरी लॉगिन",
    registerButton: "शेतकरी नोंदणी"
  },
  hi: {
    welcome: "किसानों का स्वागत है!",
    loginButton: "किसान लॉगिन",
    registerButton: "किसान पंजीकरण"
  }
};

const buttonStyle = {
  width: '250px',
  padding: '15px',
  fontSize: '24px',
  margin: '10px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '10px',
  color: 'white',
  fontFamily: 'Segoe UI Black',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s, background-color 0.3s',
};

const FarmerPage = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const handleLoginClick = () => {
    navigate('/farmer-login');
  };

  const handleRegisterClick = () => {
    navigate('/farmer-register');
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: `url(${farmerBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <LanguageSelector />
      {/* Background Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
        zIndex: 1,
      }}></div>

      {/* Content (with higher z-index to be on top of the overlay) */}
      <div style={{ zIndex: 2, textAlign: 'center' }}>
        <h1 style={{
          fontSize: '36px',
          color: '#ffffff',
          fontFamily: 'Cooper Black',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          marginBottom: '40px',
        }}>
          {t.welcome}
        </h1>
        
        <button 
          style={{ 
            ...buttonStyle, 
            backgroundColor: '#2f855a' 
          }}
          onClick={handleLoginClick}
          onMouseEnter={e => e.target.style.backgroundColor = '#38a169'}
          onMouseLeave={e => e.target.style.backgroundColor = '#2f855a'}
        >
          {t.loginButton}
        </button>
        
        <button 
          style={{ 
            ...buttonStyle, 
            backgroundColor: '#2f855a',
            marginTop: '20px',
          }}
          onClick={handleRegisterClick}
          onMouseEnter={e => e.target.style.backgroundColor = '#38a169'}
          onMouseLeave={e => e.target.style.backgroundColor = '#2f855a'}
        >
          {t.registerButton}
        </button>
      </div>
    </div>
  );
};

export default FarmerPage;