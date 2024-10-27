import React from 'react';
import './FarmerAccountPage.css'; // Custom CSS
import FarmerNavBar from './FarmerNavBar'; // Import FarmerNavBar
import farmerIcon from './assets/farmer.jpg'; // Default farmer icon image
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const FarmerAccountPage = () => {
    const farmer = JSON.parse(localStorage.getItem('farmer')); // Get farmer info from local storage
    const navigate = useNavigate();

    // Handle logout functionality
    const handleLogout = () => {
        localStorage.removeItem('farmer'); // Clear farmer data from local storage
        navigate('/'); // Redirect to the homepage after logout
    };

    return (
        <>
            {/* Reuse FarmerNavBar for easy navigation with onLogout prop */}
            <FarmerNavBar onLogout={handleLogout} />

            <div className="farmer-account-container">
                {farmer ? (
                    <div className="account-card">
                        {/* Farmer Icon */}
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
