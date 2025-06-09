import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Import useNavigate
import HomePage from './components/HomePage';
import FarmerPage from './components/FarmerPage';
import BuyerPage from './components/BuyerPage';
import FarmerLogin from './components/FarmerLogin';
import FarmerRegister from './components/FarmerRegister';
import BuyerLogin from './components/BuyerLogin';
import BuyerRegister from './components/BuyerRegister';
import BuyerDashboard from './components/BuyerDashboard';
import FarmerAnalytics from './components/FarmerAnalytics';


import Products from './components/Products';
import Cart from './components/Cart'; // Import CartPage if created
import FarmerDashboard from './components/FarmerDashboard'; // Import the component
import ProductSellingPage from './components/ProductSellingPage';
import OrdersPage from './components/OrdersPage';  // Create OrdersPage component
import YourProductsPage from './components/YourProductsPage'; // Import the new component
import FarmerAccountPage from './components/FarmerAccountPage'; // Import the account page
import BuyerAccountPage from './components/BuyerAccountPage'; // Import Buyer Account page
import '@fortawesome/fontawesome-free/css/all.min.css';
import SubscriptionFormPage from './components/SubscriptionForm';
import AdminDashboardPage from './components/Admin';
import SubscriptionFarmerPage from './components/SubscriptionFarmer';
import YourProducts from './components/YourProducts';
import CheckoutPage from './components/CheckoutPage';
import FarmerOrders from './components/FarmerOrders';
import YourOrders from './components/YourOrders';
import FarmingToolsPage from './components/FarmingToolsPage';
import BuyerSubscriptionPage from './components/SubscriptionForm';
import ResourceHubPage from './components/ResourceHubPage';
import PredictCrop from './components/PredictCrop';
import { LanguageProvider } from './context/LanguageContext';


// Create a wrapper component for handling logout and navigation
const AppRoutes = () => {
  const navigate = useNavigate(); // Initialize the navigation hook

  // Central logout function for both buyers and farmers
  const handleLogout = () => {
    const userType = localStorage.getItem('farmer') ? 'farmer' : localStorage.getItem('buyer') ? 'buyer' : null;
    
    if (userType) {
      localStorage.removeItem(userType); // Clear the appropriate user type (farmer/buyer)
      navigate('/'); // Redirect to the home page
    }
  };

  // Route protection: Redirect if no user is logged in
  const ProtectedRoute = ({ children }) => {
    const farmer = localStorage.getItem('farmer');
    const buyer = localStorage.getItem('buyer');
    
    if (!farmer && !buyer) {
      navigate('/'); // Redirect to home if neither buyer nor farmer is logged in
    }
    
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/farmers" element={<FarmerPage />} />
      <Route path="/buyers" element={<BuyerPage />} />
      <Route path="/farmer-login" element={<FarmerLogin />} />
      <Route path="/farmer-register" element={<FarmerRegister />} />
      <Route path="/buyer-login" element={<BuyerLogin />} />
      <Route path="/buyer-register" element={<BuyerRegister />} />
      <Route path="/subscription-form" element={<BuyerSubscriptionPage />} />
      <Route path="/subscription-form-farmer" element={<SubscriptionFarmerPage />} />
      <Route path="/your-products" element={<YourProducts />} />
      <Route path="/api/checkout" element={<CheckoutPage />} />
      <Route path="/farmer-orders" element={<FarmerOrders />} />
      <Route path="/buyer-orders" element={<YourOrders />} />
      <Route path="/farming-tools-page" element={<FarmingToolsPage />} />
      <Route path="/predict" element={<PredictCrop />} />
      <Route path="/farmer-analytics" element={<ProtectedRoute><FarmerAnalytics /></ProtectedRoute>} />






      





      <Route path="/admin-page" element={<AdminDashboardPage />} />


      {/* Protected routes for Farmer Dashboard and Pages */}
      <Route path="/farmer-dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/farmer-account" element={<ProtectedRoute><FarmerAccountPage onLogout={handleLogout} /></ProtectedRoute>} />
      <Route path="/your-products" element={<ProtectedRoute><YourProductsPage /></ProtectedRoute>} />
      <Route path="/sell" element={<ProtectedRoute><ProductSellingPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/resource-hub" element={<ProtectedRoute><ResourceHubPage /></ProtectedRoute>} />

      {/* Protected routes for Buyer Dashboard and Pages */}
      <Route path="/buyer-dashboard" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
      <Route path="/buyer-account" element={<ProtectedRoute><BuyerAccountPage onLogout={handleLogout} /></ProtectedRoute>} />

      <Route path="/products/:category" element={<Products />} /> {/* Dynamic route */}
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

// Main App Component with Router
const App = () => {
  return (
    <LanguageProvider>
    <Router>
      <AppRoutes /> {/* Use the wrapper component */}
    </Router>
    </LanguageProvider>
  );
};

export default App;
