import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BuyerNavBar from './BuyerNavBar';
import { fetchFromApi } from '../api'; // ✅ import centralized helper

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const navigate = useNavigate();
    const deliveryFee = 45;
    const freeDeliveryThreshold = 300;

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please log in to view your cart");
                navigate('/buyer-login');
                return;
            }

            try {
                const response = await fetchFromApi('/api/cart', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Failed to fetch cart items');
                const data = await response.json();

                if (data.success) {
                    setCartItems(data.cartItems);
                    calculateTotalPrice(data.cartItems);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
                toast.error('Failed to load cart items. Please try again.');
            }
        };

        const fetchUserSubscriptionStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetchFromApi('/api/user/status', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsSubscribed(data.is_subscribed);
                }
            } catch (error) {
                console.error('Error fetching subscription status:', error);
            }
        };

        fetchCartItems();
        fetchUserSubscriptionStatus();
    }, [navigate]);

    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
        setTotalPrice(total);
    };

    const removeFromCart = async (id) => {
        const token = localStorage.getItem('token');
        const updatedItems = cartItems.filter(item => item._id !== id);
        setCartItems(updatedItems);
        calculateTotalPrice(updatedItems);
        toast.success('Item removed from cart!');

        try {
            const response = await fetchFromApi(`/api/cart/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove item');
            }

            const data = await response.json();
            if (!data.success) {
                toast.error(data.message);
                setCartItems(cartItems); // revert
                calculateTotalPrice(cartItems);
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
            toast.error('Failed to remove item from cart. Please try again.');
            setCartItems(cartItems); // revert
            calculateTotalPrice(cartItems);
        }
    };

    const updateQuantityOnBackend = async (id, newQuantity) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetchFromApi('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: id, quantity: newQuantity })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update quantity');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error("Failed to update quantity. Please try again.");
            return null;
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) {
            toast.error("Quantity must be at least 1.");
            return;
        }

        const updatedItems = cartItems.map(item =>
            item.productId._id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        calculateTotalPrice(updatedItems);

        const response = await updateQuantityOnBackend(id, newQuantity);
        if (!response || !response.success) {
            const revertItems = cartItems.map(item =>
                item.productId._id === id ? { ...item, quantity: cartItems.find(i => i.productId._id === id).quantity } : item
            );
            setCartItems(revertItems);
            calculateTotalPrice(revertItems);
        }
    };

    const handleCheckout = () => {
        navigate('/api/checkout');
    };

    const deliveryCharge = isSubscribed ? 0 : (totalPrice > freeDeliveryThreshold ? 0 : deliveryFee);

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
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item.productId._id} className="cart-item">
                                        <img
                                            src={item.productId.imageUrl ? `http://localhost:5000/${item.productId.imageUrl}` : 'fallback.png'}
                                            alt={item.productId.name}
                                            className="cart-item-image"
                                        />
                                        <div className="cart-item-details">
                                            <h3>{item.productId.name}</h3>
                                            <p>Price: ₹{item.productId.price} / {item.productId.unit}</p>
                                            <div className="quantity-controls">
                                                <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>+</button>
                                            </div>
                                            <button className="remove-button" onClick={() => removeFromCart(item._id)}>
                                                <i className="fas fa-trash-alt"></i> Remove from Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

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

                                {!isSubscribed && totalPrice < freeDeliveryThreshold && (
                                    <p className="free-delivery-message">Free delivery on orders above ₹300. <strong>Subscribe to waive delivery fees!</strong></p>
                                )}
                                {isSubscribed && (
                                    <p className="free-delivery-message">Free delivery for subscribed users!</p>
                                )}

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
