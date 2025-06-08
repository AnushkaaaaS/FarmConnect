import React from 'react';
import './FarmingToolsPage.css';
import FarmerNavBar from './FarmerNavBar';
import { useNavigate } from 'react-router-dom';

// Sample product data with original and discounted prices in rupees
const products = [
    {
      id: 1,
      name: "Hand Trowel",
      description: "Essential for digging, planting, and transferring soil.",
      originalPrice: 500,
      discountedPrice: 400,
      image: "/shovel.jpeg",
    },
    {
      id: 2,
      name: "Pruning Shears",
      description: "Sharp and durable shears for pruning plants.",
      originalPrice: 800,
      discountedPrice: 650,
      image: "/shears.jpeg",
    },
    {
      id: 3,
      name: "Gardening Gloves",
      description: "Protect your hands with durable gardening gloves.",
      originalPrice: 200,
      discountedPrice: 150,
      image: "/gloves.jpeg",
    },
    {
      id: 4,
      name: "Watering Can",
      description: "Compact watering can with a steady flow spout.",
      originalPrice: 600,
      discountedPrice: 500,
      image: "/wateringcan.jpeg",
    },
    {
      id: 5,
      name: "Garden Hoe",
      description: "Lightweight hoe for easy soil cultivation.",
      originalPrice: 700,
      discountedPrice: 550,
      image: "/hoe.jpeg",
    },
    {
      id: 6,
      name: "Rake",
      description: "Perfect for gathering leaves and debris.",
      originalPrice: 400,
      discountedPrice: 300,
      image: "/rake.jpeg",
    },
    {
      id: 7,
      name: "Spray Bottle",
      description: "Small spray bottle for misting plants.",
      originalPrice: 150,
      discountedPrice: 120,
      image: "/spray.jpeg",
    },
    {
      id: 8,
      name: "Plant Labels",
      description: "100-pack of durable plant labels.",
      originalPrice: 250,
      discountedPrice: 200,
      image: "/labels.jpeg",
    },
    {
      id: 9,
      name: "Seedling Tray",
      description: "Tray with multiple cells for seed starting.",
      originalPrice: 300,
      discountedPrice: 250,
      image: "/seedlingtray.jpeg",
    },
  ];
  

// Calculate discount percentage
const calculateDiscountPercentage = (original, discounted) => {
  return Math.round(((original - discounted) / original) * 100);
};

function FarmingToolsPage() {
  const navigate=useNavigate()

  const handleLogout = () => {
    navigate('/');
};

const handleOrders = () => {
    navigate('/farmer-orders');
};

const handleSellProducts = () => {
    navigate('/sell');
};

  return (<>
    <FarmerNavBar 
    onOrdersClick={handleOrders} 
    onSellClick={handleSellProducts} 
    onLogout={handleLogout} 
/>
    <div className="product-page">
      <h1>Farming Tools</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <div className="product-price-container">
              <p className="original-price">₹{product.originalPrice.toLocaleString()}</p>
              <p className="discounted-price">₹{product.discountedPrice.toLocaleString()}</p>
              <p className="discount-percentage">
                {calculateDiscountPercentage(product.originalPrice, product.discountedPrice)}% OFF
              </p>
            </div>
            <button className="shop-now-button">Shop Now</button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default FarmingToolsPage;
