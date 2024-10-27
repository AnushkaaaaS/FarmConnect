// SubsSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types'; // Optional, for type checking

const SubsSection = ({ subscriptionImage, handleOnClick }) => {

    const navigate = useNavigate()
    return (
        <div className="subscription-section">
            <div className="subscription-content">
                <div className="subscription-image">
                    <img src={subscriptionImage} alt="Subscription Benefits" />
                </div>
                <div className="subscription-text">
                    <h2>Join Our Subscription Plan</h2>
                    <p>Unlock exclusive benefits to maximize your farming potential!</p>
                    <ul className="subscription-benefits">
                        <li><b>Enjoy special offers on our services and tools.</b></li>
                        <li><b>Connect with fellow farmers to share experiences and advice.</b></li>
                        <li><b>Receive alerts on market trends to make informed decisions.</b></li>
                        <li><b>Gain tools and information that enhance your productivity.</b></li>
                    </ul>
                    <button className="subscribe-btn" onClick={()=>{navigate("/subscription-form")}}>Subscribe Now</button>
                </div>
            </div>
        </div>
    );
};

// Optional: Prop Types for type checking


export default SubsSection;
