import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchFromApi } from '../api'; // adjust path if api.js is in another folder
import './Admin.css'; // CSS file for styling

function AdminDashboardPage() {
    const [buyers, setBuyers] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserSubscriptions = async () => {
            try {
                const response = await fetchFromApi('/admin-page');
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setBuyers(data.buyers || []);
                    setFarmers(data.farmers || []);
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

    const handleLogout = () => {
        localStorage.removeItem('admin');
        navigate('/');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-dashboard">
            <nav className="navbar">
                <div className="navbar-logo" onClick={() => navigate('/admin-dashboard')}>
                    <h2>FarmConnect</h2>
                </div>
                <ul className="navbar-links">
                    <li onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
                    </li>
                </ul>
            </nav>

            <h1>Admin Dashboard</h1>
            <div className="table-container">
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
