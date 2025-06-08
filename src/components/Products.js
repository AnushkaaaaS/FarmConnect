import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Products.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BuyerNavBar from './BuyerNavBar';

const Products = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [farmerDetails, setFarmerDetails] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const navigate = useNavigate();

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

    const toggleKisanDetails = async (productId) => {
        setSelectedProduct((prevProductId) => {
            if (prevProductId === productId) {
                setFarmerDetails({});
                return null;
            } else {
                fetchFarmerDetails(productId);
                setIsModalOpen(true); // Open the modal when farmer details are shown
                return productId;
            }
        });
    };

    const fetchFarmerDetails = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}/farmer-details`);
            const data = await response.json();
            if (data.success) {
                setFarmerDetails(data.farmerDetails);
            } else {
                toast.error("Failed to fetch farmer details.");
            }
        } catch (error) {
            console.error('Error fetching farmer details:', error);
            toast.error("An error occurred while fetching farmer details.");
        }
    };

    const addToCart = async (product) => {
        const selectedQuantity = quantities[product._id] || 0;
        if (selectedQuantity <= 0) {
            toast.error("Please select a quantity!");
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId: product._id, quantity: selectedQuantity })
            });
            const data = await response.json();
            if (data.success) {
                toast.success(`${product.name} has been added to your cart!`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error("An error occurred while adding to cart.");
        }
    };

    const handleQuantityChange = (productId, value) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: parseInt(value, 10)
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null); // Clear selected product when closing
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
                                        <select 
                                            className="product-options" 
                                            value={quantities[product._id] || ''} 
                                            onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                        >
                                            <option value="">Select Quantity</option>
                                            {[...Array(product.quantity)].map((_, index) => (
                                                <option key={index} value={index + 1}>
                                                    {index + 1} {product.unit}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="price-section">
                                            <span className="new-price">₹{product.price} / {product.unit}</span>
                                        </p>
                                        <div className="button-container">
                                            <button className="kisan-details-btn" onClick={() => toggleKisanDetails(product._id)}>
                                                Show Farmer Details
                                            </button>
                                            <button className="add-to-cart" onClick={() => addToCart(product)}>
                                                <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                                            </button>
                                        </div>
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

            {/* Modal for displaying farmer details */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-modal-btn" onClick={closeModal}>✖</button>
                        <h4>Farmer Details</h4>
                        {farmerDetails ? (
                            <>
                                <p><strong>Name:</strong> {farmerDetails.name}</p>
                                <p><strong>Location:</strong> {farmerDetails.location}</p>
                                <p><strong>Total Area:</strong> {farmerDetails.totalArea}</p>
                                <p><strong>Area Under Cultivation:</strong> {farmerDetails.areaUnderCultivation}</p>
                                <p><strong>Crop Cycle:</strong> {farmerDetails.cropCycle}</p>
                                <p><strong>Agriculture Method:</strong> {farmerDetails.agricultureMethod}</p>
                            </>
                        ) : (
                            <p>Loading farmer details...</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Products;
