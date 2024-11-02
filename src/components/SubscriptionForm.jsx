import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SubscriptionForm.css';

function SubscriptionFormPage() {
    const [email, setEmail] = useState("");
    const [subscriptionType, setSubscriptionType] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [loading, setLoading] = useState(false); // New loading state
    const navigate = useNavigate();

    const validateInput = () => {
        // Simple validations
        if (!/^\d{16}$/.test(cardNumber)) {
            alert('Card number must be 16 digits.');
            return false;
        }
        if (!/^\d{3}$/.test(cvv)) {
            alert('CVV must be 3 digits.');
            return false;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            alert('Expiry date must be in MM/YY format.');
            return false;
        }
        return true;
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate input
        if (!validateInput()) {
            return;
        }

        // Data to be sent to the backend
        const formData = {
            email,
            subscriptionType,
            cardNumber,
            expiryDate,
            cvv
        };

        try {
            // Set loading state
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            setLoading(false); // Reset loading state

            if (response.ok) {
                alert('Subscription successful!');
                navigate("/buyer-dashboard");
            } else {
                const errorData = await response.json();
                console.error('Error data:', errorData); // Log error data for debugging
                alert(`Subscription failed: ${errorData.message}`);
            }
        } catch (error) {
            setLoading(false); // Reset loading state
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="subscription-form-page-container">
            <h1 className="page-title">Subscribe to Our Service</h1>
            <div className="form-container">
                <div className="columns-wrapper">
                    <div className="form-column">
                        <h2>Payment Information</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subscriptionType">Subscription Type:</label>
                                <select
                                    id="subscriptionType"
                                    value={subscriptionType}
                                    onChange={(e) => setSubscriptionType(e.target.value)}
                                    required
                                >
                                    <option value="">Select Subscription Type</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="cardNumber">Card Number:</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength="16"
                                    required
                                    placeholder="Enter 16-digit card number"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="expiryDate">Expiry Date:</label>
                                <input
                                    type="text"
                                    id="expiryDate"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    placeholder="MM/YY"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cvv">CVV:</label>
                                <input
                                    type="text"
                                    id="cvv"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    placeholder="CVV"
                                    required
                                />
                            </div>

                            <div className="form-group full-width-button">
                                <button type="submit" className="subscribe-button" disabled={loading}>
                                    {loading ? 'Subscribing...' : 'Subscribe Now'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionFormPage;
