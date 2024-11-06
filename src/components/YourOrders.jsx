// src/components/YourOrders.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BuyerNavBar from '../BuyerNavBar';

const YourOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please log in to view your orders");
                navigate('/buyer-login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/orders', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                if (data.success) {
                    setOrders(data.orders);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Failed to load orders. Please try again.');
            }
        };

        fetchOrders();
    }, [navigate]);

    return (
        <>
            <BuyerNavBar />
            <div className="your-orders-container">
                <h1>Your Orders</h1>
                <div className="orders-list">
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <div key={order._id} className="order-card">
                                <h2>Order ID: {order._id}</h2>
                                <p><strong>Status:</strong> {order.status}</p>
                                <div className="order-items">
                                    {order.cartItems.map((item, index) => (
                                        <div key={index} className="order-item">
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
                                <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                                <p><strong>Delivery Address:</strong> {order.address.street}, {order.address.city}, {order.address.zip}</p>
                                <p><strong>Payment Method:</strong> {order.paymentDetails.method || "Credit/Debit Card"}</p>
                            </div>
                        ))
                    ) : (
                        <p>No orders found.</p>
                    )}
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default YourOrders;
