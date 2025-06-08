import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = localStorage.getItem('buyerToken') !== null;

  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/buyer-login" />}
    />
  );
};

export default PrivateRoute;
