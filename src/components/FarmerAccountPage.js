import React, { useState, useEffect } from 'react';
import './FarmerAccountPage.css';
import FarmerNavBar from './FarmerNavBar';
import farmerIcon from './assets/farmer.jpg';
import { useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../api';  // import your helper

const FarmerAccountPage = () => {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmer = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated. Please login.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetchFromApi('/api/farmer/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch farmer profile');
        }

        const data = await res.json();
        setFarmer(data.farmer);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setFarmer(null);
    navigate('/');
  };

  return (
    <>
      <FarmerNavBar onLogout={handleLogout} />

      <div className="farmer-account-container">
        {loading ? (
          <p>Loading farmer details...</p>
        ) : error ? (
          <p>{error}</p>
        ) : farmer ? (
          <div className="account-card">
            <div className="profile-image-container">
              <img src={farmerIcon} alt="Farmer Profile" />
            </div>
            <h1 className="profile-heading">Farmer Profile</h1>
            <div className="profile-details">
              <p><strong>First Name:</strong> {farmer.firstName}</p>
              <p><strong>Last Name:</strong> {farmer.lastName}</p>
              <p><strong>Email:</strong> {farmer.email}</p>
            </div>
          </div>
        ) : (
          <p>No farmer details available. Please register or log in.</p>
        )}
      </div>
    </>
  );
};

export default FarmerAccountPage;
