import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './BuyerNavBar.css';
import SubscribedLabel from './SubscribedLabel';


const BuyerNavBar = () => {

    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchUserSubscriptionStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }
        
                const response = await fetch('http://localhost:5000/api/user/status', {
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

        fetchUserSubscriptionStatus();
    }, []);  


    const navigate = useNavigate();
    const buyer = JSON.parse(localStorage.getItem('buyer')); // Fetch buyer details from localStorage

    // Handle Account Click - Navigates to buyer's profile page
    const handleAccountClick = () => {
        if (buyer && buyer._id) {
            navigate(`/buyer-account`); // Navigate to the buyer's profile page with ID
        } else {
            console.log('Buyer ID not found'); // Handle scenario where buyer is not logged in
        }
    };

    // Handle Cart Click - Navigates to Cart Page
    const handleCartClick = () => {
        navigate('/cart'); // Navigate to the CartPage
    };

    // Handle Logout - Clear localStorage and navigate to the homepage
    const handleLogout = () => {
        localStorage.removeItem('buyer'); // Remove buyer data from localStorage
        navigate('/'); // Redirect to the homepage after logout
    };

    const handleOrderClick=()=>{
        navigate("/buyer-orders")
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={() => navigate('/buyer-dashboard')}>
                <h2>FarmConnect</h2> {/* Acts as a home link to buyer dashboard */}
            </div>
           

            <ul className="navbar-links">
            {isSubscribed ?<li >
                    <SubscribedLabel></SubscribedLabel>
                </li>:null}
                <li onClick={() => navigate('/buyer-dashboard')}>Home</li>

                {/* Cart Icon */}
                <li onClick={handleCartClick}>
                    <FontAwesomeIcon icon={faShoppingCart} className="icon" /> My Cart
                </li>

               

                {/* Account Icon */}
                <li onClick={handleAccountClick}>
                    <FontAwesomeIcon icon={faUser} className="icon" /> Account
                </li>

                <li onClick={handleOrderClick}>
                     Your Orders
                </li>

                {/* Logout Icon */}
                <li onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
                </li>
            </ul>
        </nav>
    );
};

export default BuyerNavBar;
