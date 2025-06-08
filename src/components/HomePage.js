
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTractor, FaUtensils } from 'react-icons/fa';  // Font Awesome icons for Farmer and Foodie

const buttonStyle = {
  width: '300px',
  padding: '15px',
  fontSize: '18px',
  margin: '10px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '12px',
  color: 'white',
  fontFamily: 'Segoe UI Black',
  textAlign: 'center',
  display: 'flex', // Flexbox for aligning the icon and text
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
};

const iconStyle = {
  marginRight: '10px', // Space between the icon and the text
  fontSize: '20px',
};

const HomePage = () => {
  const navigate = useNavigate();

  const handleFarmerClick = () => {
    navigate('/farmers');
  };

  const handleFoodieClick = () => {
    navigate('/buyers');
  };
  const handleAdminClick=()=>{
    navigate('/admin-page')
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      backgroundColor: '#f0f5f3',
      boxSizing: 'border-box',
    }}>
      {/* Left Section for Image */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f7e5',
        borderRadius: '0px',
      }}>
        <img
          src="/image.jpg" // Update this with the actual path for the image
          alt="Farmers market scene"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Right Section for Buttons and Text */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px',
        backgroundColor: '#78cc78',
        borderRadius: '0px',
      }}>
        <h2 style={{ fontSize: '36px', marginBottom: '20px', fontFamily: 'Segoe UI Black', color: '#333' }}>
          Let's Get Started On Your Journey
        </h2>
        <p style={{ fontSize: '20px', marginBottom: '30px', color: '#6c757d' }}>
          <b>Tell us who you are, so we can tailor your Farmers Market experience.</b>
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Farmer Button with Icon */}
          <button
            style={{ ...buttonStyle, backgroundColor: '#38a169' }}
            onClick={handleFarmerClick}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <FaTractor style={iconStyle} />
            I'm A Farmer
            <p style={{ fontSize: '16px', marginTop: '5px', color: '#e6f4eb' }}>For those who grow the goodness.</p>
          </button>

          {/* Foodie Button with Icon */}
          <button
            style={{ ...buttonStyle, backgroundColor: '#3182ce' }}
            onClick={handleFoodieClick}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)' }
          >
            <FaUtensils style={iconStyle} />
            I'm A Foodie
            <p style={{ fontSize: '16px', marginTop: '5px', color: '#d8ecf7' }}>For those who savor the goodness.</p>
          </button>

          <button
            style={{ ...buttonStyle, backgroundColor: '#3182ce' }}
            onClick={handleAdminClick}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)' }
          >
            I'm the Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;