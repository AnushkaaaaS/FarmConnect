import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faBook } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import './FarmerNavBar.css'; // Import your custom CSS
import SubscribedLabel from './SubscribedLabel';

const FarmerNavBar = ({ onLogout }) => {
    const navigate = useNavigate();


    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchFarmerSubscriptionStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }
        
                const response = await fetch('https://farmconnect-by0t.onrender.com/api/farmer/status', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
        
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    throw new Error(errorData.message || 'Network response was not ok');
                }
        
                const data = await response.json();
                setIsSubscribed(data.is_subscribed);
            } catch (error) {
                console.error('Error fetching subscription status:', error);
            }
        };

        fetchFarmerSubscriptionStatus();
    }, []);

    return (
        <nav className="farmer-navbar">
            <div className="navbar-logo" onClick={() => navigate('/farmer-dashboard')}>
                <h2>FarmConnect</h2> {/* Acts as the home link */}
            </div>
            <ul className="navbar-links">
           {isSubscribed? <li><SubscribedLabel></SubscribedLabel></li> :null}


                <li onClick={() => navigate('/farmer-dashboard')}>Home</li>
                <li onClick={() => navigate('/resource-hub')}>
                    <FontAwesomeIcon icon={faBook} className="icon" /> Resource Hub
                </li>



                {/* Account Icon */}
                <li onClick={() => navigate('/farmer-account')}> {/* Navigate to FarmerAccountPage */}
                    <FontAwesomeIcon icon={faUser} className="icon" /> Account
                </li>
                <li onClick={() => navigate('/predict')}> {/* Navigate to FarmerAccountPage */}
                    <FontAwesomeIcon icon={faUser} className="icon" /> Predict
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
