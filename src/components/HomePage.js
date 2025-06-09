import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { FaTractor, FaUtensils } from 'react-icons/fa';

const translations = {
  en: {
    welcome: "Let's Get Started On Your Journey",
    description: "Tell us who you are, so we can tailor your Farmers Market experience.",
    farmerButton: "I'm A Farmer",
    farmerSubtext: "For those who grow the goodness.",
    buyerButton: "I'm A Foodie",
    buyerSubtext: "For those who savor the goodness.",
    adminButton: "I'm the Admin"
  },
  mr: {
    welcome: "चला आपल्या प्रवासाला सुरुवात करू",
    description: "आम्हाला सांगा तुम्ही कोण आहात, जेणेकरून आम्ही तुमचा शेतकरी बाजार अनुभव तयार करू शकू.",
    farmerButton: "मी शेतकरी आहे",
    farmerSubtext: "जे चांगुलपणा वाढवतात त्यांच्यासाठी.",
    buyerButton: "मी खाद्यप्रेमी आहे",
    buyerSubtext: "जे चांगुलपणा चाखतात त्यांच्यासाठी.",
    adminButton: "मी प्रशासक आहे"
  },
  hi: {
    welcome: "चलिए अपनी यात्रा शुरू करें",
    description: "हमें बताएं कि आप कौन हैं, ताकि हम आपका किसान बाजार अनुभव तैयार कर सकें।",
    farmerButton: "मैं किसान हूं",
    farmerSubtext: "जो अच्छाई उगाते हैं उनके लिए।",
    buyerButton: "मैं फूडी हूं",
    buyerSubtext: "जो अच्छाई का स्वाद लेते हैं उनके लिए।",
    adminButton: "मैं प्रशासक हूं"
  }
};

const buttonStyle = {
  width: '300px',
  padding: '15px',
  fontSize: '18px',
  margin: '10px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '12px',
  color: 'white',
  fontFamily: 'Segoe UI Black',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
};

const iconStyle = {
  marginRight: '10px',
  fontSize: '20px',
};

const HomePage = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const handleFarmerClick = () => {
    navigate('/farmers');
  };

  const handleFoodieClick = () => {
    navigate('/buyers');
  };

  const handleAdminClick = () => {
    navigate('/admin-page');
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      backgroundColor: '#f0f5f3',
      boxSizing: 'border-box',
    }}>
      <LanguageSelector />
      {/* Left Section for Image */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f7e5',
        borderRadius: '0px',
      }}>
        <img
          src="/image.jpg"
          alt="Farmers market scene"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Right Section for Buttons and Text */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px',
        backgroundColor: '#78cc78',
        borderRadius: '0px',
      }}>
        <h2 style={{ fontSize: '36px', marginBottom: '20px', fontFamily: 'Segoe UI Black', color: '#333' }}>
          {t.welcome}
        </h2>
        <p style={{ fontSize: '20px', marginBottom: '30px', color: '#6c757d' }}>
          <b>{t.description}</b>
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Farmer Button with Icon */}
          <button
            style={{ ...buttonStyle, backgroundColor: '#38a169' }}
            onClick={handleFarmerClick}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <FaTractor style={iconStyle} />
            {t.farmerButton}
            <p style={{ fontSize: '16px', marginTop: '5px', color: '#e6f4eb' }}>{t.farmerSubtext}</p>
          </button>

          {/* Foodie Button with Icon */}
          <button
            style={{ ...buttonStyle, backgroundColor: '#3182ce' }}
            onClick={handleFoodieClick}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <FaUtensils style={iconStyle} />
            {t.buyerButton}
            <p style={{ fontSize: '16px', marginTop: '5px', color: '#d8ecf7' }}>{t.buyerSubtext}</p>
          </button>

          <button
            style={{ ...buttonStyle, backgroundColor: '#3182ce' }}
            onClick={handleAdminClick}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {t.adminButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;