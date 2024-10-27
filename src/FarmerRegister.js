
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { ToastContainer, toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS
import farmerRegisterBackground from './assets/farmerpagebck.jpg'; // Import your background image

const FarmerRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize the navigation

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Invalid email address');
      return;
    }
    
    
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/farmer-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set Content-Type to JSON
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }), // Send the body as JSON
      });

      const data = await response.json();
      console.log('Response data:', data); // Add this line for debugging

      if (!data.success) {
        setErrorMessage(data.message);
      } else {
        // Show success notification
        toast.success('Registration successful!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Store farmer details in local storage
        localStorage.setItem('farmer', JSON.stringify({ firstName, lastName, email }));

        // Reset the form fields
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        // Redirect to the login page after a delay
        setTimeout(() => {
          navigate('/farmer-login');
        }, 2000); // 2 seconds delay before navigation
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
      backgroundImage: `url(${farmerRegisterBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      {/* Background overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
      }}></div>

      <div style={{ zIndex: 2, textAlign: 'center' }}>
        <h2 style={{
          fontSize: '32px',
          marginBottom: '20px',
          fontFamily: 'Cooper Black',
          color: '#fff',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        }}>Farmer Registration</h2>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ margin: '10px', padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ margin: '10px', padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ margin: '10px', padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
            required
          />
         
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ margin: '10px', padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ margin: '10px', padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
            required
          />

          {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}

          <button
            type="submit"
            style={{
              width: '300px',
              padding: '12px',
              fontSize: '24px',
              backgroundColor: loading ? '#94d3a2' : '#38a169',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              fontFamily: 'Segoe UI Black'
            }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>

      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
};

export default FarmerRegister;