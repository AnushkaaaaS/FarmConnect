import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom v6
import "./AdminLogin.css";

function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook to navigate

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic check to ensure fields are filled
        if (!username || !password) {
            setError('Both fields are required.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                navigate('/admin-page'); // Redirect to admin dashboard on success
            } else {
                const data = await response.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred while logging in.');
        }
    };

    return (
        <div className="admin-login">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default AdminLoginPage;
