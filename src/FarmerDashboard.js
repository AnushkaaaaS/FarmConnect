import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerNavBar from './FarmerNavBar';
import './FarmerDashboard.css';
import aboutImage from './assets/farmer.jpg';
import subscriptionImage from './assets/subscription-image.png';
import SubsSection from './components/SubSection'; // Assuming you have a SubsSection component

const FarmerDashboard = () => {
    const navigate = useNavigate();
    const salesAnalyticsRef = useRef(null);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchUserSubscriptionStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await fetch('http://localhost:5000/api/farmer/status', {
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

    const handleLogout = () => {
        navigate('/');
    };

    const handleOrders = () => {
        navigate('/farmer-orders');
    };

    const handleSellProducts = () => {
        navigate('/sell');
    };

    const handleShopNowClick = () => {
        if (salesAnalyticsRef.current) {
            salesAnalyticsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleViewProducts = () => {
        navigate('/your-products');
    };

    return (
        <div className="dashboard-container">
            <FarmerNavBar 
                onOrdersClick={handleOrders} 
                onSellClick={handleSellProducts} 
                onLogout={handleLogout} 
            />

            <div className="hero-section">
                <div className="hero-content">
                    <h1>Empowering Farmers, Connecting You to Your Market</h1>
                    <p>
                        Sell your produce, connect with buyers, and grow your business with FarmConnect.
                    </p>
                    <button className="shop-now-btn" onClick={handleShopNowClick}>Get Started</button>
                </div>
            </div>

            <div className="featured-categories" ref={salesAnalyticsRef}>
                <h2>Dashboard Categories</h2>
                <div className="categories-container">
                    <div className="category">
                        <h3>Sell Your Produce</h3>
                        <p>Connect directly with buyers and sell your fresh produce with ease.</p>
                        <button onClick={handleSellProducts} className="go-to-sell-btn">Go to Sell</button>
                    </div>
                    <div className="category">
                        <h3>Your Products</h3>
                        <p>Manage and showcase your products effectively to attract customers.</p>
                        <button onClick={handleViewProducts} className="view-products-btn">View Products</button>
                    </div>
                    <div className="category">
                        <h3>Your Orders</h3>
                        <p>Keep track of all your orders and streamline your sales process.</p>
                        <button onClick={handleOrders} className="view-orders-btn">View Orders</button>
                    </div>
                </div>
            </div>

            <div className="about-us-section">
                <div className="about-us-content">
                    <h2>About Us</h2>
                    <p><b>
                        At FarmConnect, we empower farmers to directly connect with consumers, enhancing their market reach. Our platform ensures that your high-quality agricultural products are easily accessible, enabling you to grow your business while providing fresh produce to your community.
                    </b></p>
                </div>
                <img src={aboutImage} alt="About Us" className="about-us-image" />
            </div>

            {!isSubscribed ? (
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
                            <button onClick={() => { navigate("/subscription-form-farmer") }} className="subscribe-btn">Subscribe Now</button>
                        </div>
                    </div>
                </div>
            ) : null} {/* Render nothing if subscribed */}

        </div>
    );
};

export default FarmerDashboard;
