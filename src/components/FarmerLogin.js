import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for redirecting after login
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import farmerLoginBackground from '../assets/farmerpagebck.jpg'; // Import your background image
import { toast, ToastContainer } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles

const translations = {
  en: {
    title: "Farmer Login",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    loginButton: "Login",
    loadingText: "Logging in...",
    successMessage: "Login successful!",
    errorMessage: "Invalid email or password",
    generalError: "An error occurred. Please try again."
  },
  mr: {
    title: "शेतकरी लॉगिन",
    emailPlaceholder: "ईमेल",
    passwordPlaceholder: "पासवर्ड",
    loginButton: "लॉगिन",
    loadingText: "लॉगिन होत आहे...",
    successMessage: "लॉगिन यशस्वी!",
    errorMessage: "अवैध ईमेल किंवा पासवर्ड",
    generalError: "एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा."
  },
  hi: {
    title: "किसान लॉगिन",
    emailPlaceholder: "ईमेल",
    passwordPlaceholder: "पासवर्ड",
    loginButton: "लॉगिन",
    loadingText: "लॉगिन हो रहा है...",
    successMessage: "लॉगिन सफल!",
    errorMessage: "अमान्य ईमेल या पासवर्ड",
    generalError: "एक त्रुटी हुई। कृपया पुनः प्रयास करें।"
  }
};

const FarmerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage(t.errorMessage);
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('https://farmconnect-by0t.onrender.com/api/farmer-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t.successMessage, { position: "top-center", autoClose: 2000 });
        console.log('Farmer Login:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('farmer', JSON.stringify(data.farmer));
        navigate('/farmer-dashboard');
      } else {
        setErrorMessage(data.message || t.errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(t.generalError);
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
      <LanguageSelector />
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
          {t.title}
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
            placeholder={t.emailPlaceholder}
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
            placeholder={t.passwordPlaceholder}
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
            {loading ? t.loadingText : t.loginButton}
          </button>
        </form>

        <ToastContainer /> {/* Added ToastContainer for toast notifications */}
      </div>
    </div>
  );
};

export default FarmerLogin;