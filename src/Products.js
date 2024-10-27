
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Products.css'; // CSS for styling the products page
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'; // Import the cart icon
import { ToastContainer, toast } from 'react-toastify'; // Import toast components
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import BuyerNavBar from './BuyerNavBar'; // Correct import for the NavBar component

const Products = () => {
    const { category } = useParams(); // Get the category from URL
    const [products, setProducts] = useState([]); // Load products based on category
    const [selectedProduct, setSelectedProduct] = useState(null); // State to manage selected product for farmer details
    const navigate = useNavigate(); // Hook for navigation

    // Fetch products from the API when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(`http://localhost:5000/api/products?category=${category}`);
            const data = await response.json();
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error("Failed to fetch products.");
            }
        };

        fetchProducts();
    }, [category]);

    // Toggle farmer details visibility
    const toggleKisanDetails = (productId) => {
        setSelectedProduct((prevProductId) => (prevProductId === productId ? null : productId));
    };

   // Function to handle Add to Cart action
const addToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item._id === product._id);

    if (existingItem) {
        // If the item already exists in the cart, increment the quantity
        existingItem.quantity += 1;
    } else {
        // If it's a new item, add it to the cart
        cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update localStorage
    toast.success(`${product.name} has been added to your cart!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};


    return (
        <>
            <BuyerNavBar
                onCartClick={() => navigate('/cart')}
                onAccountClick={() => navigate('/buyer-account')}
                onLogout={() => navigate('/buyer-login')}
            />

            <div className="products-page-container">
                <div className="sidebar">
                    <h2>Categories</h2>
                    <ul>
                        <li onClick={() => navigate('/products/fruits')}>Fruits</li>
                        <li onClick={() => navigate('/products/vegetables')}>Vegetables</li>
                        <li onClick={() => navigate('/products/grains')}>Grains</li>
                    </ul>
                </div>

                <div className="products-container">
                    <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Products</h1>
                    <div className="products-grid">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} className="product-card">
                                    <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.name} className="product-image" />
                                    <div className="product-details">
                                        <h3>{product.name}</h3>

                                        {/* Displaying quantity options with unit */}
                                        <select className="product-options">
                                            <option value="">Select Quantity</option>
                                            {[...Array(product.quantity)].map((_, index) => (
                                                <option key={index} value={index + 1}>
                                                    {index + 1} {product.unit} {/* Show unit here */}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Display price with unit */}
                                        <p className="price-section">
                                            <span className="new-price">₹{product.price} / {product.unit}</span> {/* Show unit alongside price */}
                                        </p>

                                        <div className="button-container">
                                            <button className="kisan-details-btn" onClick={() => toggleKisanDetails(product._id)}>
                                                {selectedProduct === product._id ? 'Hide Farmer Details' : 'Show Farmer Details'}
                                            </button>
                                            <button className="add-to-cart" onClick={() => addToCart(product)}>
                                                <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                                            </button>
                                        </div>
                                        {selectedProduct === product._id && (
                                            <div className="farmer-details">
                                                <h4>Farmer Details:</h4>
                                                <p><strong>Name:</strong> {product.farmerDetails.farmerName}</p>
                                                <p><strong>Location:</strong> {product.farmerDetails.location}</p>
                                                <p><strong>Total Area:</strong> {product.farmerDetails.totalArea}</p>
                                                <p><strong>Area Under Cultivation:</strong> {product.farmerDetails.areaUnderCultivation}</p>
                                                <p><strong>Crop Cycle:</strong> {product.farmerDetails.cropCycle}</p>
                                                <p><strong>Agriculture Method:</strong> {product.farmerDetails.agricultureMethod}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No products available in this category.</p>
                        )}
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </>
    );
};

export default Products;