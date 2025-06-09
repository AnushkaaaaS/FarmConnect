import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faBook, faChartLine, faSeedling, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './FarmerNavBar.css';
import SubscribedLabel from './SubscribedLabel';
import { useLanguage } from '../context/LanguageContext';

const translations = {
  en: {
    home: "Home",
    account: "Account",
    logout: "Logout",
    resourceHub: "Resource Hub",
    analytics: "Analytics",
    predict: "Predict"
  },
  mr: {
    home: "होम",
    account: "खाते",
    logout: "लॉगआउट",
    resourceHub: "संसाधन केंद्र",
    analytics: "विश्लेषण",
    predict: "भविष्यवाणी"
  },
  hi: {
    home: "होम",
    account: "खाता",
    logout: "लॉगआउट",
    resourceHub: "संसाधन केंद्र",
    analytics: "विश्लेषण",
    predict: "पूर्वानुमान"
  }
};

const FarmerNavBar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  useEffect(() => {
    const fetchFarmerSubscriptionStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('https://farmconnect-by0t.onrender.com/api/farmer/status', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setIsSubscribed(data.is_subscribed);
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      }
    };

    fetchFarmerSubscriptionStatus();
  }, []);

  const handleToggleMenu = () => setMenuOpen(!menuOpen);
  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="farmer-navbar">
      <div className="navbar-logo" onClick={() => handleNavigate('/farmer-dashboard')}>
        <h2>FarmConnect</h2>
      </div>
      <div className="hamburger" onClick={handleToggleMenu}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </div>
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {isSubscribed && <li><SubscribedLabel /></li>}
        <li onClick={() => handleNavigate('/farmer-dashboard')}>{t.home}</li>
        <li onClick={() => handleNavigate('/resource-hub')}>
          <FontAwesomeIcon icon={faBook} className="icon" /> {t.resourceHub}
        </li>
        <li onClick={() => handleNavigate('/farmer-analytics')}>
          <FontAwesomeIcon icon={faChartLine} className="icon" /> {t.analytics}
        </li>
        <li onClick={() => handleNavigate('/farmer-account')}>
          <FontAwesomeIcon icon={faUser} className="icon" /> {t.account}
        </li>
        <li onClick={() => handleNavigate('/predict')}>
          <FontAwesomeIcon icon={faSeedling} className="icon" /> {t.predict}
        </li>
        <li onClick={() => { onLogout(); setMenuOpen(false); }}>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> {t.logout}
        </li>
      </ul>
    </nav>
  );
};

export default FarmerNavBar;
