import React, { useEffect, useState } from "react";
import './Admin.css'; // CSS file for styling

function AdminDashboardPage() {
    const [buyers, setBuyers] = useState([]); // State for buyers
    const [farmers, setFarmers] = useState([]); // State for farmers
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserSubscriptions = async () => {
            try {
                const response = await fetch('http://localhost:5000/admin-page');
                if (response.ok) {
                    const data = await response.json();
                    console.log(data); // Debug: Check data structure
                    setBuyers(data.buyers || []); // Set only buyers data
                    setFarmers(data.farmers || []); // Set only farmers data
                } else {
                    console.error('Failed to fetch subscriptions');
                }
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserSubscriptions();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="table-container">
                {/* Buyers Table */}
                <h2>Buyers</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Subscription Status</th>
                            <th>Subscription Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buyers.map((buyer) => (
                            <tr key={buyer._id}>
                                <td>
                                    {buyer.firstName && buyer.lastName
                                        ? `${buyer.firstName} ${buyer.lastName}`
                                        : 'N/A'}
                                </td>
                                <td>{buyer.email || 'N/A'}</td>
                                <td>{buyer.phoneNumber || 'N/A'}</td>
                                <td>{buyer.subscription ? 'Active' : 'Inactive'}</td>
                                <td>{buyer.subscription?.subscriptionType || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Farmers Table */}
                <h2>Farmers</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Subscription Status</th>
                            <th>Subscription Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {farmers.map((farmer) => (
                            <tr key={farmer._id}>
                                <td>
                                    {farmer.firstName && farmer.lastName
                                        ? `${farmer.firstName} ${farmer.lastName}`
                                        : 'N/A'}
                                </td>
                                <td>{farmer.email || 'N/A'}</td>
                                <td>{farmer.phoneNumber || 'N/A'}</td>
                                <td>{farmer.subscription ? 'Active' : 'Inactive'}</td>
                                <td>{farmer.subscription?.subscriptionType || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboardPage;
