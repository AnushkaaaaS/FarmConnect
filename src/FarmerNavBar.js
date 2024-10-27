import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import './FarmerNavBar.css'; // Import your custom CSS

const FarmerNavBar = ({ onLogout }) => {
    const navigate = useNavigate();

    return (
        <nav className="farmer-navbar">
            <div className="navbar-logo" onClick={() => navigate('/farmer-dashboard')}>
                <h2>FarmConnect</h2> {/* Acts as the home link */}
            </div>
            <ul className="navbar-links">
                <li onClick={() => navigate('/farmer-dashboard')}>Home</li>

                {/* Account Icon */}
                <li onClick={() => navigate('/farmer-account')}> {/* Navigate to FarmerAccountPage */}
                    <FontAwesomeIcon icon={faUser} className="icon" /> Account
                </li>

                {/* Logout Icon */}
                <li onClick={onLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
                </li>
            </ul>
        </nav>
    );
};

export default FarmerNavBar;
