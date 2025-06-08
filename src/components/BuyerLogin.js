import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import buyerBackground from '../assets/buyerpagebck.avif';

const buttonStyle = {
  width: '300px',
  padding: '10px',
  fontSize: '20px',
  margin: '10px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '5px',
  color: 'white',
  fontFamily: 'Segoe UI Black',
  backgroundColor: '#3182ce',
  transition: 'background-color 0.3s',
};

const BuyerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    try {
      const response = await fetch('https://farmconnect-by0t.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('buyer', JSON.stringify(data.buyer));
        localStorage.setItem('token', data.token);
        console.log(data.token);

        toast.success('Login successful!', { position: "top-center", autoClose: 2000 });
        setTimeout(() => navigate('/buyer-dashboard'), 2000);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred. Please check email and password');
      console.error('Error:', error);
    }
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: `url(${buyerBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
      }}></div>

      <div style={{ zIndex: 2, textAlign: 'center' }}>
        <h2 style={{
          fontSize: '36px',
          color: '#ffffff',
          fontFamily: 'Cooper Black',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          marginBottom: '20px',
        }}>
          Buyer Login
        </h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ margin: '10px', padding: '10px', width: '300px' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ margin: '10px', padding: '10px', width: '300px' }}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={e => e.target.style.backgroundColor = '#4299e1'}
            onMouseLeave={e => e.target.style.backgroundColor = '#3182ce'}
          >
            Login
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default BuyerLogin;
