
import React from 'react';
import { useNavigate } from 'react-router-dom';
import farmerBackground from '../assets/farmerpagebck.jpg'; // Ensure correct path

const buttonStyle = {
  width: '250px',
  padding: '15px',
  fontSize: '24px',
  margin: '10px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '10px',
  color: 'white',
  fontFamily: 'Segoe UI Black',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s, background-color 0.3s',
};

const FarmerPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/farmer-login');
  };

  const handleRegisterClick = () => {
    navigate('/farmer-register');
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: `url(${farmerBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      {/* Background Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
        zIndex: 1,
      }}></div>

      {/* Content (with higher z-index to be on top of the overlay) */}
      <div style={{ zIndex: 2, textAlign: 'center' }}>
        <h1 style={{
          fontSize: '36px',
          color: '#ffffff',
          fontFamily: 'Cooper Black',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          marginBottom: '40px',
        }}>
          Welcome Farmers!
        </h1>
        
        <button 
          style={{ 
            ...buttonStyle, 
            backgroundColor: '#2f855a' 
          }}
          onClick={handleLoginClick}
          onMouseEnter={e => e.target.style.backgroundColor = '#38a169'}
          onMouseLeave={e => e.target.style.backgroundColor = '#2f855a'}
        >
          Farmer Login
        </button>
        
        <button 
          style={{ 
            ...buttonStyle, 
            backgroundColor: '#2f855a',
            marginTop: '20px',
          }}
          onClick={handleRegisterClick}
          onMouseEnter={e => e.target.style.backgroundColor = '#38a169'}
          onMouseLeave={e => e.target.style.backgroundColor = '#2f855a'}
        >
          Farmer Register
        </button>
      </div>
    </div>
  );
};

export default FarmerPage;