import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BuyerNavBar from './BuyerNavBar';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [address, setAddress] = useState({});
    const [isSubscribed, setIsSubscribed] = useState(false);
    const navigate = useNavigate();
    const freeDeliveryThreshold = 300;

    useEffect(() => {
        // Fetch subscription status from API
        fetchUserSubscriptionStatus();
        
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
                    calculateTotalPrice(data.cartItems);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
                toast.error('Failed to load cart items. Please try again.');
            }
        };

        fetchCartItems();
    }, [navigate]);

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
                setIsSubscribed(data.is_subscribed);
            }
        } catch (error) {
            console.error('Error fetching subscription status:', error);
        }
    };

    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
        setTotalPrice(total);
    };

    const handleOrderSubmit = async () => {
        const orderDetails = {
            buyerId: localStorage.getItem('buyerId'),
            cartItems,
            totalPrice: totalPrice + deliveryFee,
            address,
        };

        try {
            const response = await fetch('http://localhost:5000/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(orderDetails),
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Order placed successfully!');
                
                setTimeout(() => {
                    navigate('/buyer-dashboard');
                }, 2000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order. Please try again.');
        }
    };

    const handleProceedToPayment = () => {
        if (!address.street || !address.city || !address.zip) {
            toast.error("Please fill in all address fields");
            return;
        }

        const amountInPaise = (totalPrice + deliveryFee) * 100;

        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        const initiatePayment = async () => {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error("Failed to load Razorpay SDK. Please try again.");
                return;
            }

            const options = {
                key: 'rzp_test_2BZTggwTEwm8GC', // Replace with your Razorpay key
                amount: amountInPaise,
                currency: 'INR',
                name: 'FarmConnect',
                description: 'Order Payment',
                handler: function (response) {
                    toast.success("Payment successful! Payment ID: " + response.razorpay_payment_id);
                    handleOrderSubmit(); // Place the order after successful payment
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        };

        initiatePayment();
    };

    // Adjust delivery fee based on subscription status
    const deliveryCharge = isSubscribed ? 0 : (totalPrice > freeDeliveryThreshold ? 0 : 45); // Free delivery for subscribed users or total above ₹300

    return (
        <>
            <BuyerNavBar
                onCartClick={() => navigate('/cart')}
                onAccountClick={() => navigate('/account')}
                onLogout={() => navigate('/buyer-login')}
            />
            <div className="checkout-page-container">
                <h1>Checkout</h1>
                <div className="checkout-content">
                    <div className="checkout-section">
                        <h2>Address</h2>
                        <input
                            type="text"
                            placeholder="Street"
                            value={address.street}
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="ZIP Code"
                            value={address.zip}
                            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                            required
                        />
                    </div>

                    <div className="checkout-section">
                        <h2>Review Your Order</h2>
                        <div className="review-items">
                            {cartItems.map(item => (
                                <div key={item.productId._id} className="review-item">
                                    <img
                                        src={item.productId.imageUrl ? `http://localhost:5000/${item.productId.imageUrl}` : "path/to/placeholder-image.png"}
                                        alt={item.productId.name}
                                    />
                                    <div>
                                        <h4>{item.productId.name}</h4>
                                        <p>Price: ₹{item.productId.price} x {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="order-summary">
                            <p className="delivery-fee">Delivery Fee: ₹{deliveryCharge}</p>
                            <h3>Total Price: ₹{(totalPrice + deliveryCharge).toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                <button className="submit-button" onClick={handleProceedToPayment}>Proceed to Payment</button>
                <ToastContainer />
            </div>
        </>
    );
};

export default CheckoutPage;
