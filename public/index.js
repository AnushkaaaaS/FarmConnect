import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CartProvider } from './context/CartContext'; // Import the provider

ReactDOM.render(
  <React.StrictMode>
    <CartProvider> {/* Ensure this is wrapping the entire app */}
      <App />
    </CartProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
