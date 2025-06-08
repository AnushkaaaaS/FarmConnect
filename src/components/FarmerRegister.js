import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import farmerRegisterBackground from './assets/farmerpagebck.jpg';

const FarmerRegister = () => {
  const [basicInfo, setBasicInfo] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [farmerDetails, setFarmerDetails] = useState({  location: '', totalArea: '', areaUnderCultivation: '', cropCycle: '', agricultureMethod: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e, setFunc, field) => {
    setFunc((prev) => ({ ...prev, [field]: e.target.value }));
  };




  const handleRegister = async (e) => {
    e.preventDefault();
  
    const { password, confirmPassword, email, firstName, lastName } = basicInfo;  // Destructure the values from basicInfo
  
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
      const response = await fetch('https://farmconnect-by0t.onrender.com/api/farmer-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          farmerDetails, // Sending farmer details
        }),
      });
  
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.message);
      } else {
        toast.success('Registration successful!', { position: 'top-center', autoClose: 3000 });
        localStorage.setItem('farmer', JSON.stringify({ firstName, lastName, email }));
        setTimeout(() => navigate('/farmer-login'), 2000);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: `url(${farmerRegisterBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

        gap: '5px',
        padding: '200px 250px',
        borderRadius: '10px',
      }}>
        {/* Form Start */}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <h2 style={{
            fontSize: '32px',
            fontFamily: 'Cooper Black',
            color: '#333',
            marginBottom: '15px',
            textAlign:'center'
          }}>Farmer Registration</h2>
          <div style={{ display: 'flex', gap: '30px' }}>
            {/* Basic Information Section */}
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>Basic Information</h3>
              <input type="text" placeholder="First Name" value={basicInfo.firstName} onChange={(e) => handleInputChange(e, setBasicInfo, 'firstName')} required style={inputStyle} />
              <input type="text" placeholder="Last Name" value={basicInfo.lastName} onChange={(e) => handleInputChange(e, setBasicInfo, 'lastName')} required style={inputStyle} />
              <input type="email" placeholder="Email" value={basicInfo.email} onChange={(e) => handleInputChange(e, setBasicInfo, 'email')} required style={inputStyle} />
              <input type="password" placeholder="Password" value={basicInfo.password} onChange={(e) => handleInputChange(e, setBasicInfo, 'password')} required style={inputStyle} />
              <input type="password" placeholder="Confirm Password" value={basicInfo.confirmPassword} onChange={(e) => handleInputChange(e, setBasicInfo, 'confirmPassword')} required style={inputStyle} />
            </div>

            {/* Farmer Details Section */}
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>Farmer Details</h3>
              <input type="text" placeholder="Location" value={farmerDetails.location} onChange={(e) => handleInputChange(e, setFarmerDetails, 'location')} required style={inputStyle} />
              <input type="number" placeholder="Total Area (in acres)" value={farmerDetails.totalArea} onChange={(e) => handleInputChange(e, setFarmerDetails, 'totalArea')} required style={inputStyle} />
              <input type="number" placeholder="Area Under Cultivation (in acres)" value={farmerDetails.areaUnderCultivation} onChange={(e) => handleInputChange(e, setFarmerDetails, 'areaUnderCultivation')} required style={inputStyle} />
              <input type="text" placeholder="Crop Cycle" value={farmerDetails.cropCycle} onChange={(e) => handleInputChange(e, setFarmerDetails, 'cropCycle')} required style={inputStyle} />
              <input type="text" placeholder="Agriculture Method" value={farmerDetails.agricultureMethod} onChange={(e) => handleInputChange(e, setFarmerDetails, 'agricultureMethod')} required style={inputStyle} />
            </div>
          </div>

          {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

const inputStyle = {
  margin: '10px 0',
  padding: '10px',
  width: '70%',
  borderRadius: '5px',
  border: '1px solid #ccc',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
};

const buttonStyle = {
  marginTop: '20px',
  width: '50%',
  padding: '12px',
  fontSize: '18px',
  backgroundColor: '#38a169',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

export default FarmerRegister;
