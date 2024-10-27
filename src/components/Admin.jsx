import React, { useEffect, useState } from "react";
import './Admin.css'; // CSS file for styling

function AdminDashboardPage() {
    const [userSubscriptions, setUserSubscriptions] = useState([]);
    const [farmerSubscriptions, setFarmerSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await fetch('http://localhost:5000/admin-page');
                if (response.ok) {
                    const data = await response.json();
                    console.log(data); // Debug: Check data structure
                    setUserSubscriptions(data.userSubscriptions || []);
                    setFarmerSubscriptions(data.farmerSubscriptions || []);
                } else {
                    console.error('Failed to fetch subscriptions');
                }
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="table-container">
                {/* User Subscriptions Table */}
                <h2>User Subscriptions</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Buyer Name</th>
                            <th>Email</th>
                            <th>Subscription Type</th>
                            <th>Card Number</th>
                            <th>Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userSubscriptions.map((subscription) => (
                            <tr key={subscription._id}>
                                <td>
                                    {subscription.buyer?.firstName && subscription.buyer?.lastName
                                        ? `${subscription.buyer.firstName} ${subscription.buyer.lastName}`
                                        : 'N/A'}
                                </td>
                                <td>{subscription.buyer?.email || 'N/A'}</td>
                                <td>{subscription.subscriptionType || 'N/A'}</td>
                                <td>
                                    {subscription.cardNumber
                                        ? subscription.cardNumber.replace(/\d(?=\d{4})/g, "*")
                                        : 'N/A'}
                                </td>
                                <td>{subscription.expiryDate || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Farmer Subscriptions Table */}
                <h2>Farmer Subscriptions</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Farmer Name</th>
                            <th>Email</th>
                            <th>Subscription Type</th>
                            <th>Card Number</th>
                            <th>Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {farmerSubscriptions.map((subscription) => (
                            <tr key={subscription._id}>
                                <td>
                                    {subscription.farmer?.firstName && subscription.farmer?.lastName
                                        ? `${subscription.farmer.firstName} ${subscription.farmer.lastName}`
                                        : 'N/A'}
                                </td>
                                <td>{subscription.farmer?.email || 'N/A'}</td>
                                <td>{subscription.subscriptionType || 'N/A'}</td>
                                <td>
                                    {subscription.cardNumber
                                        ? subscription.cardNumber.replace(/\d(?=\d{4})/g, "*")
                                        : 'N/A'}
                                </td>
                                <td>{subscription.expiryDate || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboardPage;
