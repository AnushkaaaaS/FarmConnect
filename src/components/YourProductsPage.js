
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const YourProductsPage = () => {
    const [products, setProducts] = useState([]);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('farmerToken'); // Fetch token from localStorage
    
                if (!token) {
                    console.error('No token found, please login');
                    return;
                }
    
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add token in Authorization header
                    },
                };
    
                const response = await axios.get('https://farmconnect-by0t.onrender.com/api/farmer/products', config);
                setProducts(response.data); // Set the products data
            } catch (error) {
                console.error("Error fetching farmer's products", error);
            }
        };
    
        fetchProducts();
    }, []);
    

    

    return (
        <div className='product-page'>
            <h1>Your Products</h1>
            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        <h3>{product.name}</h3>
                        <p>Category: {product.category}</p>
                        <p>Price: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default YourProductsPage;