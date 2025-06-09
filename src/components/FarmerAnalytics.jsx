import React, { useEffect, useState } from 'react';
import FarmerNavBar from './FarmerNavBar';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import './FarmerAnalytics.css';

const translations = {
  en: {
    title: "Farmer Dashboard",
    loading: "Loading dashboard...",
    error: "Error loading dashboard. Please try again.",
    totalLandArea: "Total Land Area",
    areaUnderCultivation: "Area Under Cultivation",
    totalProducts: "Total Products Listed",
    totalRevenue: "Total Revenue",
    featuredStatus: "Featured Farmer Status",
    acres: "acres",
    products: "products",
    currency: "₹",
    yes: "Yes",
    no: "No",
    utilizationRate: "Land Utilization Rate",
    percentage: "%",
    landDistribution: "Land Distribution",
    unusedLand: "Unused Land",
    performance: "Performance Metrics",
    growth: "Growth Rate",
    efficiency: "Efficiency Score"
  },
  mr: {
    title: "शेतकरी डॅशबोर्ड",
    loading: "डॅशबोर्ड लोड करत आहे...",
    error: "डॅशबोर्ड लोड करण्यात त्रुटी. कृपया पुन्हा प्रयत्न करा.",
    totalLandArea: "एकूण जमीन क्षेत्र",
    areaUnderCultivation: "लागवडीखालील क्षेत्र",
    totalProducts: "एकूण उत्पादने",
    totalRevenue: "एकूण उत्पन्न",
    featuredStatus: "फीचर्ड शेतकरी स्थिती",
    acres: "एकर",
    products: "उत्पादने",
    currency: "₹",
    yes: "होय",
    no: "नाही",
    utilizationRate: "जमीन वापर दर",
    percentage: "%",
    landDistribution: "जमीन वितरण",
    unusedLand: "अवापरित जमीन",
    performance: "कार्यक्षमता मेट्रिक्स",
    growth: "वाढ दर",
    efficiency: "कार्यक्षमता स्कोअर"
  },
  hi: {
    title: "किसान डैशबोर्ड",
    loading: "डैशबोर्ड लोड हो रहा है...",
    error: "डैशबोर्ड लोड करने में त्रुटि। कृपया पुनः प्रयास करें।",
    totalLandArea: "कुल भूमि क्षेत्र",
    areaUnderCultivation: "खेती के तहत क्षेत्र",
    totalProducts: "कुल उत्पाद",
    totalRevenue: "कुल राजस्व",
    featuredStatus: "फीचर्ड किसान स्थिति",
    acres: "एकड़",
    products: "उत्पाद",
    currency: "₹",
    yes: "हाँ",
    no: "नहीं",
    utilizationRate: "भूमि उपयोग दर",
    percentage: "%",
    landDistribution: "भूमि वितरण",
    unusedLand: "अप्रयुक्त भूमि",
    performance: "प्रदर्शन मेट्रिक्स",
    growth: "वृद्धि दर",
    efficiency: "दक्षता स्कोर"
  }
};

const FarmerAnalytics = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://farmconnect-by0t.onrender.com/api/farmer/analytics', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const calculateUtilizationRate = () => {
    if (!analytics?.totalLandArea || !analytics?.areaUnderCultivation) return 0;
    return ((analytics.areaUnderCultivation / analytics.totalLandArea) * 100).toFixed(1);
  };

  const getUnusedLand = () => {
    if (!analytics?.totalLandArea || !analytics?.areaUnderCultivation) return 0;
    return analytics.totalLandArea - analytics.areaUnderCultivation;
  };

  if (loading) {
    return (
      <div className="farmer-analytics-container">
        <FarmerNavBar />
        <LanguageSelector />
        <div className="analytics-content">
          <h1>{t.title}</h1>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="farmer-analytics-container">
        <FarmerNavBar />
        <LanguageSelector />
        <div className="analytics-content">
          <h1>{t.title}</h1>
          <p className="error">{t.error}</p>
          <p className="error-details">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="farmer-analytics-container">
      <FarmerNavBar />
      <LanguageSelector />
      <div className="analytics-content">
        <h1>{t.title}</h1>
        
        {/* Main Stats Section */}
        <div className="stats-section">
          <div className="stat-card primary">
            <div className="stat-icon">🌾</div>
            <div className="stat-info">
              <h3>{t.totalLandArea}</h3>
              <p className="stat-value">{analytics?.totalLandArea || 0} {t.acres}</p>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{t.totalRevenue}</h3>
              <p className="stat-value">{t.currency}{analytics?.totalRevenue || 0}</p>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{t.totalProducts}</h3>
              <p className="stat-value">{analytics?.totalProducts || 0}</p>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>{t.featuredStatus}</h3>
              <p className="stat-value">{analytics?.isFeatured ? t.yes : t.no}</p>
            </div>
          </div>
        </div>

        {/* Performance Section */}
        <div className="performance-section">
          <h2>{t.performance}</h2>
          <div className="performance-grid">
            <div className="performance-card">
              <div className="performance-header">
                <h3>{t.utilizationRate}</h3>
                <span className="performance-value">{calculateUtilizationRate()}%</span>
              </div>
              <div className="performance-bar">
                <div 
                  className="performance-fill"
                  style={{ 
                    width: `${calculateUtilizationRate()}%`,
                    backgroundColor: calculateUtilizationRate() > 80 ? '#4CAF50' : 
                                   calculateUtilizationRate() > 50 ? '#FFA500' : '#FF4444'
                  }}
                ></div>
              </div>
            </div>

            <div className="performance-card">
              <div className="performance-header">
                <h3>{t.growth}</h3>
                <span className="performance-value">+12.5%</span>
              </div>
              <div className="performance-bar">
                <div className="performance-fill" style={{ width: '75%', backgroundColor: '#4CAF50' }}></div>
              </div>
            </div>

            <div className="performance-card">
              <div className="performance-header">
                <h3>{t.efficiency}</h3>
                <span className="performance-value">85%</span>
              </div>
              <div className="performance-bar">
                <div className="performance-fill" style={{ width: '85%', backgroundColor: '#4CAF50' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Land Distribution Section */}
        <div className="distribution-section">
          <h2>{t.landDistribution}</h2>
          <div className="distribution-container">
            <div className="distribution-chart">
              <div className="chart-segment cultivated" style={{ 
                width: `${(analytics?.areaUnderCultivation / analytics?.totalLandArea) * 100}%` 
              }}>
                <span className="segment-label">{t.areaUnderCultivation}</span>
              </div>
              <div className="chart-segment unused" style={{ 
                width: `${(getUnusedLand() / analytics?.totalLandArea) * 100}%` 
              }}>
                <span className="segment-label">{t.unusedLand}</span>
              </div>
            </div>
            <div className="distribution-stats">
              <div className="stat-item">
                <span className="stat-label">{t.areaUnderCultivation}</span>
                <span className="stat-value">{analytics?.areaUnderCultivation || 0} {t.acres}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t.unusedLand}</span>
                <span className="stat-value">{getUnusedLand()} {t.acres}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerAnalytics; 