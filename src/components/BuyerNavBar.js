import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './BuyerNavBar.css';
import SubscribedLabel from './SubscribedLabel';
import { fetchFromApi } from '../api'; // Adjust the path if necessary

const BuyerNavBar = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();
  const buyer = JSON.parse(localStorage.getItem('buyer'));

  useEffect(() => {
    const fetchUserSubscriptionStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetchFromApi('/api/user/status', {
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

  const handleAccountClick = () => {
    if (buyer && buyer._id) {
      navigate(`/buyer-account`);
    } else {
      console.log('Buyer ID not found');
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLogout = () => {
    localStorage.removeItem('buyer');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleOrderClick = () => {
    navigate('/buyer-orders');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/buyer-dashboard')}>
        <h2>FarmConnect</h2>
      </div>

      <ul className="navbar-links">
        {isSubscribed && (
          <li>
            <SubscribedLabel />
          </li>
        )}
        <li onClick={() => navigate('/buyer-dashboard')}>Home</li>

        <li onClick={handleCartClick}>
          <FontAwesomeIcon icon={faShoppingCart} className="icon" /> My Cart
        </li>

        <li onClick={handleAccountClick}>
          <FontAwesomeIcon icon={faUser} className="icon" /> Account
        </li>

        <li onClick={handleOrderClick}>Your Orders</li>

        <li onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
        </li>
      </ul>
    </nav>
  );
};

export default BuyerNavBar;
