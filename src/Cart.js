
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css'; // CSS for styling the cart page
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BuyerNavBar from './BuyerNavBar';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const deliveryFee = 45;
    const freeDeliveryThreshold = 300;

    // Load cart items from localStorage
    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items);
        calculateTotalPrice(items); // Calculate initial total
    }, []);

    // Function to calculate total price
    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    // Function to remove item from cart
    const removeFromCart = (id) => {
        const updatedItems = cartItems.filter(item => item._id !== id);
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        calculateTotalPrice(updatedItems); // Recalculate total price
        toast.success('Item removed from cart!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    // Function to update quantity
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return; // Prevent negative quantity
        const updatedItems = cartItems.map(item =>
            item._id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        calculateTotalPrice(updatedItems); // Recalculate total price
    };

    // Function to handle proceed to checkout
    const handleCheckout = () => {
        // Navigate to checkout page
        navigate('/checkout');
    };

    // Calculate the delivery fee based on total price
    const deliveryCharge = totalPrice > freeDeliveryThreshold ? 0 : deliveryFee;

    return (
        <>
            <BuyerNavBar
                onCartClick={() => navigate('/cart')}
                onAccountClick={() => navigate('/account')}
                onLogout={() => navigate('/buyer-login')}
            />
            <div className="cart-page-container">
                <h1>Your Cart</h1>
                <div className="cart-content">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <>
                            {/* Render cart items */}
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item._id} className="cart-item">
                                        <img src={`http://localhost:5000/${item.imageUrl}`} alt={item.name} className="cart-item-image" />
                                        <div className="cart-item-details">
                                            <h3>{item.name}</h3>
                                            <p>Price: ₹{item.price} / {item.unit}</p>
                                            <div className="quantity-controls">
                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                            </div>
                                            <button className="remove-button" onClick={() => removeFromCart(item._id)}>
                                                <i className="fas fa-trash-alt"></i> Remove from Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Details Card */}
                            <div className="price-details-card">
                                <h2>Price Details</h2>
                                <div className="price-detail">
                                    <p>Subtotal</p>
                                    <p>₹{totalPrice.toFixed(2)}</p>
                                </div>
                                <div className="price-detail">
                                    <p>Delivery Fee</p>
                                    <p>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</p>
                                </div>
                                <div className="price-detail total">
                                    <p>Total Amount</p>
                                    <p>₹{(totalPrice + deliveryCharge).toFixed(2)}</p>
                                </div>

                                {/* Free delivery message */}
                                {totalPrice < freeDeliveryThreshold && (
                                    <p className="free-delivery-message">Free delivery on orders above ₹300</p>
                                )}

                                {/* Proceed to Checkout Button */}
                                <button className="checkout-button" onClick={handleCheckout}>
                                    Proceed to Checkout
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default Cart;

