import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './BuyerNavBar.css';

const BuyerNavBar = () => {
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
