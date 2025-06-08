import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './YourProducts.css';
import FarmerNavBar from './FarmerNavBar';
import { fetchFromApi } from '../api';  // import your helper


const YourProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetchFromApi('api/your-products', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error fetching products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        navigate('/sell', { state: { product } });
    };

    const handleDelete = async (id) => {
        // Confirmation before deletion
        const confirmDelete = window.confirm('Are you sure you want to delete this product? This action cannot be undone.');
        if (!confirmDelete) return; // If the user cancels, do nothing

        try {
            const response = await fetchFromApi(`api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) throw new Error('Failed to delete product');
            fetchProducts(); // Refresh the product list after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Error deleting product. Please try again later.');
        }
    };

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
       <FarmerNavBar></FarmerNavBar>
        <div className="your-products-container">
            <h1>Your Products</h1>
            <div className="product-list">
                {products.map((product) => (
                    <div className="product-card" key={product._id}>
                        <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.name} />
                        <h2>{product.name}</h2>
                        <p className="description">{product.description}</p>
                        <p className="price">Price: ₹{product.price}</p>
                        <p className="quantity">Quantity: {product.quantity} {product.unit}</p>
                        <div className="button-group">
                            <button className="edit-button" onClick={() => handleEdit(product)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(product._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default YourProducts;
