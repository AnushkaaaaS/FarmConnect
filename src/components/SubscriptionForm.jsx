import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BuyerNavBar from './BuyerNavBar';
import './SubscriptionForm.css'; // Make sure to create this CSS file

const BuyerSubscriptionPage = () => {
    const [subscriptionPlan, setSubscriptionPlan] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    // Handle subscription selection
    const handleSelectPlan = (plan, amount) => {
        setSubscriptionPlan(plan);
        setTotalAmount(amount);
    };

    // Proceed to payment and handle the payment flow
    const handleProceedToPayment = () => {
        if (!subscriptionPlan) {
            toast.error("Please select a subscription plan");
            return;
        }

        const amountInPaise = totalAmount * 100; // Convert to paise

        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        const initiatePayment = async () => {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error("Failed to load Razorpay SDK. Please try again.");
                return;
            }

            const options = {
                key: 'rzp_test_2BZTggwTEwm8GC', // Use your Razorpay key
                amount: amountInPaise,
                currency: 'INR',
                name: 'FarmConnect Subscription',
                description: 'Subscription Payment',
                handler: function (response) {
                    toast.success("Payment successful! Payment ID: " + response.razorpay_payment_id);
                    handleSubscription(response.razorpay_payment_id); // Handle subscription after successful payment
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        };

        initiatePayment();
    };

    // Handle subscription after successful payment
    const handleSubscription = async (paymentId) => {
        const subscriptionDetails = {
            subscriptionType: subscriptionPlan, // Get subscription type from selected plan
            paymentId: paymentId, // Pass payment ID from Razorpay
        };

        try {
            const response = await fetch('https://farmconnect-by0t.onrender.com/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token for authorization
                },
                body: JSON.stringify(subscriptionDetails),
            });

            const data = await response.json();
            if (data.message === 'Subscription successful!') {
                toast.success('Subscription successful!');
                setTimeout(() => {
                    navigate('/buyer-dashboard'); // Redirect after subscription
                }, 2000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error subscribing:', error);
            toast.error('Failed to subscribe. Please try again.');
        }
    };

    return (
        <>
            <BuyerNavBar
                onCartClick={() => navigate('/cart')}
                onAccountClick={() => navigate('/account')}
                onLogout={() => navigate('/buyer-login')}
            />
            <div className="subscription-page-container">
                <h1>Subscribe Now</h1>
                <div className="subscription-options">
                    <div
                        className={`subscription-card ${subscriptionPlan === 'Weekly Plan' ? 'selected' : ''}`}
                        onClick={() => handleSelectPlan('Weekly Plan', 99)}
                    >
                        <h2>Weekly Plan</h2>
                        <p>Price: ₹99</p>
                        <ul>
                            <li>Access to all products</li>
                            <li>Delivery fee is waived off</li>
                        </ul>
                    </div>
                    <div
                        className={`subscription-card ${subscriptionPlan === 'Monthly Plan' ? 'selected' : ''}`}
                        onClick={() => handleSelectPlan('Monthly Plan', 299)}
                    >
                        <h2>Monthly Plan</h2>
                        <p>Price: ₹299</p>
                        <ul>
                            <li>Access to all products</li>
                            <li>Instant delivery service</li>
                            <li>Delivery fee is waived off</li>
                        </ul>
                    </div>
                    <div
                        className={`subscription-card ${subscriptionPlan === 'Yearly Plan' ? 'selected' : ''}`}
                        onClick={() => handleSelectPlan('Yearly Plan', 999)}
                    >
                        <h2>Yearly Plan</h2>
                        <p>Price: ₹999</p>
                        <ul>
                            <li>Access to all products</li>
                            <li>Instant delivery service</li>
                            <li>Delivery fee is waived off</li>
                            <li>Exclusive discounts on special occasions</li>
                        </ul>
                    </div>
                </div>
                <div className="order-summary">
                    <h3>Selected Plan: {subscriptionPlan}</h3>
                    <h3>Total Amount: ₹{totalAmount}</h3>
                </div>
                <button className="submit-button" onClick={handleProceedToPayment}>Proceed to Payment</button>
                <ToastContainer />
            </div>
        </>
    );
};

export default BuyerSubscriptionPage;

