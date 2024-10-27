import React, { useEffect, useState } from "react";
import './Admin.css'; // CSS file for styling

function AdminDashboardPage() {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await fetch('http://localhost:5000/admin-page');
                if (response.ok) {
                    const data = await response.json();
                    setSubscriptions(data);
                } else {
                    console.error('Failed to fetch subscriptions');
                }
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            }
        };

        fetchSubscriptions();
    }, []);

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="table-container">
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
                        {subscriptions.map((subscription) => (
                            <tr key={subscription._id}>
                                <td>
                                    {subscription.buyer ? `${subscription.buyer.firstName} ${subscription.buyer.lastName}` : 'N/A'}
                                </td>
                                <td>{subscription.buyer?.email || 'N/A'}</td>
                                <td>{subscription.subscriptionType}</td>
                                <td>{subscription.cardNumber.replace(/\d(?=\d{4})/g, "*")}</td>
                                <td>{subscription.expiryDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboardPage;
