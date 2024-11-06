import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BuyerNavBar from './BuyerNavBar';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false); // Add state for subscription status
    const navigate = useNavigate();
    const deliveryFee = 45;
    const freeDeliveryThreshold = 300;

    // Load cart items from backend
    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please log in to view your cart");
                navigate('/buyer-login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/cart', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }

                const data = await response.json();
                if (data.success) {
                    setCartItems(data.cartItems);
                    calculateTotalPrice(data.cartItems); // Calculate initial total
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
                const response = await fetch('http://localhost:5000/api/user/status', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsSubscribed(data.is_subscribed); // Update subscription status
                }
            } catch (error) {
                console.error('Error fetching subscription status:', error);
            }
        };

        fetchCartItems();
        fetchUserSubscriptionStatus(); // Fetch subscription status
    }, [navigate]);

    // Function to calculate total price
    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => {
            return acc + (item.productId.price * item.quantity);
        }, 0);
        setTotalPrice(total);
    };

    // Function to remove item from cart
    const removeFromCart = async (id) => {
        const token = localStorage.getItem('token');
        console.log("Attempting to remove item with ID:", id); // Log the ID being removed
    
        // Optimistically update the cart state before sending the request
        const updatedItems = cartItems.filter(item => item._id !== id); // Use item._id instead of item.productId._id
        setCartItems(updatedItems);
        calculateTotalPrice(updatedItems);
        toast.success('Item removed from cart!'); // Immediate feedback
    
        try {
            const response = await fetch(`http://localhost:5000/api/cart/${id}`, { // Ensure you're passing the correct ID
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to remove item:', errorData); // Log detailed error
                throw new Error(errorData.message || 'Failed to remove item from cart');
            }
    
            const data = await response.json();
            if (!data.success) {
                toast.error(data.message); // Show error from server response
                // If server error, revert cart state back
                setCartItems(cartItems); // Reset to original items
                calculateTotalPrice(cartItems);
            } else {
                console.log(`Item with ID ${id} successfully removed from the cart.`);
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
            toast.error('Failed to remove item from cart. Please try again.');
            // Revert the cart items if an error occurs
            setCartItems(cartItems); // Reset to original items
            calculateTotalPrice(cartItems);
        }
    };

    // Function to update quantity on backend
    const updateQuantityOnBackend = async (id, newQuantity) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: id, quantity: newQuantity }), // Sending the exact new quantity
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update quantity on backend');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error("Failed to update quantity. Please try again.");
            return null;
        }
    };

    // Update quantity function
    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) {
            toast.error("Quantity must be at least 1."); // Show error if quantity is less than 1
            return;
        }

        const updatedItems = cartItems.map(item =>
            item.productId._id === id ? { ...item, quantity: newQuantity } : item // Set to newQuantity directly
        );
        setCartItems(updatedItems);
        calculateTotalPrice(updatedItems); // Recalculate total price

        const response = await updateQuantityOnBackend(id, newQuantity); // Pass the new quantity
        if (!response || !response.success) {
            const revertItems = cartItems.map(item =>
                item.productId._id === id ? { ...item, quantity: cartItems.find(i => i.productId._id === id).quantity } : item
            );
            setCartItems(revertItems);
            calculateTotalPrice(revertItems); // Recalculate total price
        }
    };

    // Function to handle proceed to checkout
    const handleCheckout = async () => {
      navigate('/api/checkout')
    }
       

    // Calculate delivery charge based on subscription status
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
                                        <img src={item.productId.imageUrl ? `http://localhost:5000/${item.productId.imageUrl}` : 'path/to/fallback-image.png'} alt={item.productId.name} className="cart-item-image" />
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

                                {/* Conditional delivery messages based on subscription status */}
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
