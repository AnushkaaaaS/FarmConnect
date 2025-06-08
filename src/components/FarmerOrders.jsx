import React, { useEffect, useState } from 'react';
import './FarmerOrders.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import FarmerNavBar from './FarmerNavBar';

const FarmerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [showDetails, setShowDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:5000/api/farmer-orders', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data.success) {
                    setOrders(data.orders);
                } else {
                    setError(data.message);
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load orders. Please try again.');
                toast.error('Failed to load orders.');
            }
        };

        fetchOrders();
    }, []);

    const toggleDetails = (orderId) => {
        setShowDetails((prevDetails) => ({
            ...prevDetails,
            [orderId]: !prevDetails[orderId],
        }));
    };

    const updateOrderStatus = async (orderId, currentStatus) => {
        const newStatus = document.getElementById(`status-select-${orderId}`).value;
        if (newStatus && newStatus !== currentStatus) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:5000/api/update-order-status/${orderId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ newStatus }),
                });

                const data = await response.json();
                if (data.success) {
                    setOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order._id === orderId ? data.order : order
                        )
                    );
                    toast.success('Order status updated successfully!');
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error updating order status:', error);
                toast.error('Failed to update order status.');
            }
        } else {
            toast.error('No change in status. Please select a different status.');
        }
    };

    const renderOrdersByStatus = (status, statusClass) => {
        const filteredOrders = orders.filter((order) => order.status === status);
        return (
            <div className={`orders-section ${statusClass}`}>
                <h2 className={statusClass}>{status} Orders</h2>
                {filteredOrders.length === 0 && (
                    <p>No {status.toLowerCase()} orders available.</p>
                )}
                {filteredOrders.map((order) => (
                    <div key={order._id} className="order-card">
                        <h5>Order ID: {order._id}</h5>
                        {order.cartItems.map((item) => (
                            <div key={item.productId._id} className="product-card">
                                <img
                                    className="product-image"
                                    src={
                                        item.productId.imageUrl
                                            ? `http://localhost:5000/${item.productId.imageUrl}`
                                            : 'path/to/fallback-image.png'
                                    }
                                    alt={item.productId.name}
                                />
                                <div className="product-details">
                                    <h6>{item.productId.name}</h6>
                                    <p>Qty: {item.quantity}</p>
                                    <p>Price: ₹{item.productId.price}</p>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => toggleDetails(order._id)}>
                            {showDetails[order._id] ? 'Hide Buyer Details' : 'Show Buyer Details'}
                        </button>
                        {showDetails[order._id] && (
                            <div className="buyer-details">
                                <p>{order.buyerId.firstName} {order.buyerId.lastName}</p>
                                <p>Phone: {order.buyerId.phoneNumber}</p>
                                <p>Address: {order.address.street}, {order.address.city}, {order.address.zip}</p>
                            </div>
                        )}
                        <div className="status-update">
                            <select id={`status-select-${order._id}`} defaultValue={order.status}>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <button onClick={() => updateOrderStatus(order._id, order.status)}>
                                Update Status
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <FarmerNavBar />
            <div className="farmer-orders-container">
                <h1>Your Orders</h1>
                <div className="orders-container">
                    {renderOrdersByStatus('Pending', 'pending')}
                    {renderOrdersByStatus('Processing', 'processing')}
                    {renderOrdersByStatus('Completed', 'completed')}
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default FarmerOrders;
