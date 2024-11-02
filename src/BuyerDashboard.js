import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavBar from './BuyerNavBar';
import './BuyerDashboard.css';
import SubsSection from './components/SubSection';

const BuyerDashboard = () => {
    const navigate = useNavigate();
    const aboutUsRef = useRef(null);
    const featuredCategoriesRef = useRef(null);
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

    const handleLogout = () => {
        navigate('/');
    };

    const handleCart = () => {
        navigate('/cart');
    };

    const handleAccount = () => {
        navigate('/account');
    };

    const handleCategoryClick = (category) => {
        navigate(`/products/${category}`);
    };

    const handleShopNowClick = () => {
        if (featuredCategoriesRef.current) {
            featuredCategoriesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleHomeClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAboutUsClick = () => {
        if (aboutUsRef.current) {
            aboutUsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="dashboard-container">
            <BuyerNavBar 
                onCartClick={handleCart} 
                onAccountClick={handleAccount} 
                onLogout={handleLogout}
                onHomeClick={handleHomeClick}
                onAboutUsClick={handleAboutUsClick}
            />

            <div className="hero-section">
                <div className="hero-content">
                    <h1>From Farms to Your Doorstep, Fresh and Direct!</h1>
                    <p>Your Marketplace for Farm-Fresh Goods. Shop Farm-Fresh Fruits, Vegetables & More.</p>
                    <button className="shop-now-btn" onClick={handleShopNowClick}>Shop Now</button>
                </div>
            </div>

            <div className="featured-categories" ref={featuredCategoriesRef}>
                <h2>Featured Categories</h2>
                <div className="categories-container">
                    <div className="category" onClick={() => handleCategoryClick('fruits')}>
                        <img src='/fruit.jpg' alt="A variety of fresh fruits" />
                        <div className="category-title">Fruits</div>
                    </div>
                    <div className="category" onClick={() => handleCategoryClick('vegetables')}>
                        <img src="/vegetable.jpg" alt="A selection of fresh vegetables" />
                        <div className="category-title">Vegetables</div>
                    </div>
                    <div className="category" onClick={() => handleCategoryClick('grains')}>
                        <img src="/grains.jpg" alt="Different types of grains" />
                        <div className="category-title">Grains</div>
                    </div>
                </div>
            </div>

            {!isSubscribed ? (
                <SubsSection/>
            ) : (
                <div className="subscription-benefits">
                    <h2>You are Subscribed!</h2>
                    <p>Thank you for being a valued subscriber! Here are some benefits you enjoy:</p>
                    <ul>
                        <li>Free delivery on all orders</li>
                        <li>Exclusive access to special discounts and promotions</li>
                        <li>Priority customer support</li>
                    </ul>
                </div>
            )}

            <div className="about-us-section" ref={aboutUsRef}>
                <div className="about-us-content">
                    <h2>About Us</h2>
                    <p><b>
                        FarmConnect is an innovative platform designed to bridge the gap between farmers and buyers, ensuring that fresh, high-quality agricultural products reach your doorstep directly from the source. Our mission is simple: to empower farmers by giving them a marketplace to sell their produce without the burden of middlemen, while providing buyers access to fresh, affordable, and locally-sourced products.
                    </b></p>
                </div>
                <div className="about-us-stats">
                    <div className="stat-item">
                        <p>Delivery Rate</p>
                        <div className="progress-bar">
                            <div className="progress" style={{ width: "85%" }}></div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <p>Customer Satisfaction</p>
                        <div className="progress-bar">
                            <div className="progress" style={{ width: "95%" }}></div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <p>Produce Quality Rating</p>
                        <div className="progress-bar">
                            <div className="progress" style={{ width: "90%" }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;
