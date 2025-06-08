import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import buyerBackground from './assets/buyerpagebck.avif';
import { fetchFromApi } from '../api'; // ✅ import your custom fetch wrapper

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

const BuyerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateInputs = () => {
    const { phoneNumber, password, confirmPassword } = formData;
    if (!/^\d{10}$/.test(phoneNumber)) return 'Phone number must be exactly 10 digits.';
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      toast.error(validationError, { position: 'top-center', autoClose: 2500 });
      return;
    }

    setError('');
    try {
      const response = await fetchFromApi('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || 'Registration failed.';
        setError(message);
        toast.error(message, { position: 'top-center', autoClose: 2500 });
        return;
      }

      if (data.success) {
        toast.success('Registration successful!', {
          position: 'top-center',
          autoClose: 2000,
        });

        localStorage.setItem('buyerToken', data.token);

        setTimeout(() => navigate('/buyer-login'), 2000);
      }
    } catch (err) {
      console.error('Registration Error:', err);
      toast.error('Something went wrong. Please try again.', {
        position: 'top-center',
        autoClose: 2500,
      });
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
          Buyer Registration
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          {['firstName', 'lastName', 'address', 'phoneNumber', 'email', 'password', 'confirmPassword'].map((field, idx) => (
            <input
              key={idx}
              type={field.includes('password') ? 'password' : (field === 'email' ? 'email' : 'text')}
              name={field}
              placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
              value={formData[field]}
              onChange={handleChange}
              style={{ margin: '10px', padding: '10px', width: '300px' }}
              required
            />
          ))}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={buttonStyle}>Register</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default BuyerRegister;
