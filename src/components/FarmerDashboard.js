import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerNavBar from './FarmerNavBar';
import './FarmerDashboard.css';
import aboutImage from '../assets/farmer.jpg';
import subscriptionImage from '../assets/subscription-image.png';
import Footer from './Footer';
import ChatBot from './ChatBot';
import Chat from './Chat';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const salesAnalyticsRef = useRef(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const farmerData = localStorage.getItem('farmer');
  const farmer = farmerData && farmerData !== "undefined" ? JSON.parse(farmerData) : null;

  useEffect(() => {
    const fetchFarmerSubscriptionStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('https://farmconnect-by0t.onrender.com/api/farmer/status', {
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

    fetchFarmerSubscriptionStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');  // optionally clear token on logout
    localStorage.removeItem('farmer'); // clear farmer data on logout
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

  const handleViewFarmingTools = () => {
    navigate('/farming-tools-page');
  };

  return (
    <>
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

        {/* Subscription Benefits Section */}
        {isSubscribed && (
          <div className="subscription-benefits-section">
            <div className="benefits-content">
              <h2>Exclusive Access to Best Deals on Farming Tools!</h2>
              <p>
                As a FarmConnect subscriber, you can access exclusive discounts and offers on high-quality farming tools. 
                Whether you're looking to enhance your productivity or get the best deals on essential equipment, 
                our platform ensures you get the most value for your investment.
              </p>
              <button className="view-tools-btn" onClick={handleViewFarmingTools}>
                Explore Farming Tools Now
              </button>
            </div>
          </div>
        )}

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

        {!isSubscribed && (
          <div className="subscription-section">
            <div className="subscription-content">
              <div className="subscription-image">
                <img src={subscriptionImage} alt="Subscription Benefits" />
              </div>
              <div className="subscription-text">
                <h2>Join Our Subscription Plan</h2>
                <p>Unlock exclusive benefits to maximize your farming potential!</p>
                <ul className="subscription-benefits">
                  <li><b>Gain access to a wealth of discounted farming resources, tools and tips to improve your productivity.</b></li>
                  <li><b>Be featured on top for increased visibility and to showcase your products to buyers.</b></li>
                  <li><b>Receive real-time alerts on market trends and price fluctuations.</b></li>
                  <li><b>Connect with fellow farmers to share experiences and strategies for success.</b></li>
                </ul>
                <button onClick={() => navigate("/subscription-form-farmer")} className="subscribe-btn">Subscribe Now</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ChatBot />
      {farmer && <Chat userType="farmer" userId={farmer._id} userName={`${farmer.firstName} ${farmer.lastName}`} />}
    </>
  );
};

export default FarmerDashboard;
