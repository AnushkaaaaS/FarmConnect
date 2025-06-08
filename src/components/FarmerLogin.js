
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for redirecting after login
import farmerLoginBackground from './assets/farmerpagebck.jpg'; // Import your background image
import { toast, ToastContainer } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles

const FarmerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        setErrorMessage('Invalid email address');
        return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
        // Call the correct farmer login API endpoint
        const response = await fetch('http://localhost:5000/api/farmer-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Show success toast
            toast.success('Login successful!', { position: "top-center", autoClose: 2000 });
            console.log('Farmer Login:', data); // Log response data for debugging

            // Store the token in localStorage
            localStorage.setItem('token', data.token); // Store the JWT token

            // Store farmer info in localStorage (optional)
            localStorage.setItem('farmer', JSON.stringify(data.farmer));

            // Redirect to farmer dashboard on successful login
            navigate('/farmer-dashboard');
        } else {
            // If response is not OK, show an error
            setErrorMessage(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error); // Log error for debugging
        setErrorMessage('An error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
};

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: `url(${farmerLoginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: '#fff',
          fontFamily: 'Cooper Black',
        }}
      >
        <h2
          style={{
            fontSize: '32px',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          Farmer Login
        </h2>

        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              margin: '10px',
              padding: '10px',
              width: '300px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fff',
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              margin: '10px',
              padding: '10px',
              width: '300px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fff',
            }}
            required
          />

          {errorMessage && (
            <p
              style={{
                color: 'red',
                marginTop: '10px',
              }}
            >
              {errorMessage}
            </p>
          )}

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
              fontFamily: 'Segoe UI Black',
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <ToastContainer /> {/* Added ToastContainer for toast notifications */}
      </div>
    </div>
  );
};

export default FarmerLogin;