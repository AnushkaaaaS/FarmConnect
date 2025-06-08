import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FarmerNavBar from './FarmerNavBar';
import './SubsForm.css';

const SubscriptionPage = () => {
    const [subscriptionPlan, setSubscriptionPlan] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    const handleSelectPlan = (plan, amount) => {
        setSubscriptionPlan(plan);
        setTotalAmount(amount);
    };

    const handleProceedToPayment = () => {
        if (!subscriptionPlan) {
            toast.error("Please select a subscription plan");
            return;
        }

        const amountInPaise = totalAmount * 100;

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
                key: 'rzp_test_2BZTggwTEwm8GC',
                amount: amountInPaise,
                currency: 'INR',
                name: 'FarmConnect Subscription',
                description: 'Subscription Payment',
                handler: function (response) {
                    toast.success("Payment successful! Payment ID: " + response.razorpay_payment_id);
                    handleSubscription(response.razorpay_payment_id);
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

    const handleSubscription = async (paymentId) => {
        const subscriptionDetails = {
            subscriptionType: subscriptionPlan,
            paymentId: paymentId,
        };

        try {
            const response = await fetch('https://farmconnect-by0t.onrender.com/api/subscribe-farmer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(subscriptionDetails),
            });

            const data = await response.json();
            if (data.message === 'Subscription successful!') {
                toast.success('Subscription successful!');
                setTimeout(() => {
                    navigate('/farmer-dashboard');
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
            <FarmerNavBar onLogout={() => navigate('/farmer-login')} />
            <div className="checkout-page-container">
                <h1>Subscribe Now</h1>
                <p className="subscription-description">Choose a plan and enjoy exclusive benefits:</p>
                <div className="checkout-content">
                    <div className="subscription-options">
                        <div className="subscription-card">
                            <h3>Quarterly Plan</h3>
                            <p>Price: ₹399</p>
                            <ul>
                                <li>Get featured on FarmConnect</li>
                                <li>Quarterly alerts and tips</li>
                            </ul>
                            <button onClick={() => handleSelectPlan('Quarterly Plan', 399)}>Choose Quarterly</button>
                        </div>
                        <div className="subscription-card">
                            <h3>Yearly Plan</h3>
                            <p>Price: ₹799</p>
                            <ul>
                                <li>Get featured on FarmConnect</li>
                                <li>Exclusive discount on farming tools and resources</li>
                            </ul>
                            <button onClick={() => handleSelectPlan('Yearly Plan', 799)}>Choose Yearly</button>
                        </div>
                    </div>

                    <div className="order-summary">
                        <h3>Selected Plan: {subscriptionPlan}</h3>
                        <h3>Total Amount: ₹{totalAmount}</h3>
                    </div>
                </div>

                <button className="submit-button" onClick={handleProceedToPayment}>Proceed to Payment</button>
                <ToastContainer />
            </div>
        </>
    );
};

export default SubscriptionPage;
