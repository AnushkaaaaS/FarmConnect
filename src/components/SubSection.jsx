// SubsSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import subscriptionimage from "./subscription-image.png"


const SubsSection = ({ handleOnClick }) => {

    const navigate = useNavigate()
    return (
        <div className="subscription-section">
            <div className="subscription-content">
                <div className="subscription-image">
                <img src={subscriptionimage} alt="Subscription Benefits" />
                </div>
                <div className="subscription-text">
                    <h2>Join Our Subscription Plan</h2>
                    <p>Unlock exclusive benefits to maximize your farming potential!</p>
                    <ul className="subscription-benefits">
                        <li><b>Free Delivery on all orders!</b></li>
                        <li><b>Discounts on bulk purchases or seasonal items.</b></li>
                        <li><b> Access to high-demand or premium quality products that may have limited stock, reserved only for subscribers.</b></li>
                    </ul>
                    <button className="subscribe-btn" onClick={()=>{navigate("/subscription-form")}}>Subscribe Now</button>
                </div>
            </div>
        </div>
    );
};

// Optional: Prop Types for type checking


export default SubsSection;
