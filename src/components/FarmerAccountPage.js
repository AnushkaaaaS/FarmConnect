import React, { useEffect, useState } from 'react';
import './FarmerAccountPage.css'; // Custom CSS
import FarmerNavBar from './FarmerNavBar'; // Import FarmerNavBar
import farmerIcon from '../assets/farmer.jpg'; // Default farmer icon image
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const translations = {
  en: {
    title: "Farmer Profile",
    basicInfo: "Basic Information",
    farmerDetails: "Farmer Details",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    location: "Location",
    totalArea: "Total Area (in acres)",
    areaUnderCultivation: "Area Under Cultivation (in acres)",
    cropCycle: "Crop Cycle",
    agricultureMethod: "Agriculture Method",
    subscriptionStatus: "Subscription Status",
    subscriptionType: "Subscription Type",
    active: "Active",
    inactive: "Inactive",
    loading: "Loading farmer details...",
    error: "Error loading farmer details. Please try again.",
    noDetails: "No farmer details available. Please register or log in.",
    sessionExpired: "Your session has expired. Please log in again."
  },
  mr: {
    title: "शेतकरी प्रोफाइल",
    basicInfo: "मूलभूत माहिती",
    farmerDetails: "शेतकरी तपशील",
    firstName: "पहिले नाव",
    lastName: "आडनाव",
    email: "ईमेल",
    location: "स्थान",
    totalArea: "एकूण क्षेत्र (एकर)",
    areaUnderCultivation: "लागवडीखालील क्षेत्र (एकर)",
    cropCycle: "पीक चक्र",
    agricultureMethod: "शेती पद्धत",
    subscriptionStatus: "सदस्यता स्थिती",
    subscriptionType: "सदस्यता प्रकार",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    loading: "शेतकरी तपशील लोड करत आहे...",
    error: "शेतकरी तपशील लोड करण्यात त्रुटी. कृपया पुन्हा प्रयत्न करा.",
    noDetails: "शेतकरी तपशील उपलब्ध नाही. कृपया नोंदणी करा किंवा लॉगिन करा.",
    sessionExpired: "तुमचा सत्र समाप्त झाला आहे. कृपया पुन्हा लॉगिन करा."
  },
  hi: {
    title: "किसान प्रोफ़ाइल",
    basicInfo: "मूलभूत जानकारी",
    farmerDetails: "किसान विवरण",
    firstName: "पहला नाम",
    lastName: "उपनाम",
    email: "ईमेल",
    location: "स्थान",
    totalArea: "कुल क्षेत्र (एकड़)",
    areaUnderCultivation: "खेती के तहत क्षेत्र (एकड़)",
    cropCycle: "फसल चक्र",
    agricultureMethod: "कृषि पद्धति",
    subscriptionStatus: "सदस्यता स्थिति",
    subscriptionType: "सदस्यता प्रकार",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    loading: "किसान विवरण लोड हो रहा है...",
    error: "किसान विवरण लोड करने में त्रुटि। कृपया पुनः प्रयास करें।",
    noDetails: "किसान विवरण उपलब्ध नहीं है। कृपया पंजीकरण करें या लॉगिन करें।",
    sessionExpired: "आपका सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।"
  }
};

const FarmerAccountPage = () => {
    const [farmer, setFarmer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage];

    useEffect(() => {
        const fetchFarmerDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/farmer-login');
                    return;
                }

                console.log('Fetching farmer details with token:', token.substring(0, 10) + '...');

                const response = await fetch('https://farmconnect-by0t.onrender.com/api/farmer/account', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Response status:', response.status);
                const responseData = await response.json();
                console.log('Response data:', responseData);

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/farmer-login');
                        return;
                    }
                    throw new Error(responseData.message || 'Failed to fetch farmer details');
                }

                setFarmer(responseData);
            } catch (err) {
                console.error('Error fetching farmer details:', err);
                setError(err.message || 'Failed to fetch farmer details');
            } finally {
                setLoading(false);
            }
        };

        fetchFarmerDetails();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (loading) {
        return (
            <>
                <FarmerNavBar onLogout={handleLogout} />
                <LanguageSelector />
                <div className="farmer-account-container">
                    <p>{t.loading}</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <FarmerNavBar onLogout={handleLogout} />
                <LanguageSelector />
                <div className="farmer-account-container">
                    <p>{t.error}</p>
                    <p style={{ color: 'red', fontSize: '0.9em' }}>{error}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <FarmerNavBar onLogout={handleLogout} />
            <LanguageSelector />
            <div className="farmer-account-container">
                {farmer ? (
                    <div className="account-card">
                        <div className="profile-image-container">
                            <img src={farmerIcon} alt="Farmer Profile" />
                        </div>
                        <h1 className="profile-heading">{t.title}</h1>
                        
                        <div className="profile-section">
                            <h2>{t.basicInfo}</h2>
                            <div className="profile-details">
                                <p><strong>{t.firstName}:</strong> {farmer.firstName}</p>
                                <p><strong>{t.lastName}:</strong> {farmer.lastName}</p>
                                <p><strong>{t.email}:</strong> {farmer.email}</p>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h2>{t.farmerDetails}</h2>
                            <div className="profile-details">
                                <p><strong>{t.location}:</strong> {farmer.location}</p>
                                <p><strong>{t.totalArea}:</strong> {farmer.totalArea}</p>
                                <p><strong>{t.areaUnderCultivation}:</strong> {farmer.areaUnderCultivation}</p>
                                <p><strong>{t.cropCycle}:</strong> {farmer.cropCycle}</p>
                                <p><strong>{t.agricultureMethod}:</strong> {farmer.agricultureMethod}</p>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h2>{t.subscriptionStatus}</h2>
                            <div className="profile-details">
                                <p><strong>{t.subscriptionStatus}:</strong> {farmer.subscription ? t.active : t.inactive}</p>
                                {farmer.subscription && (
                                    <p><strong>{t.subscriptionType}:</strong> {farmer.subscription.subscriptionType}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>{t.noDetails}</p>
                )}
            </div>
        </>
    );
};

export default FarmerAccountPage;
