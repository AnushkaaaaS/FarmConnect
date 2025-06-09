import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './ProductSellingPage.css';
import FarmerNavBar from "./FarmerNavBar";

function ProductSellingPage() {

  const navigate=useNavigate()

  const handleLogout = () => {
    navigate('/');
};

const handleOrders = () => {
    navigate('/farmer-orders');
};

const handleSellProducts = () => {
    navigate('/sell');
};
  const location = useLocation();
  const editingProduct = location.state?.product || null;

  const [productName, setProductName] = useState(editingProduct?.name || "");
  const [description, setDescription] = useState(editingProduct?.description || "");
  const [price, setPrice] = useState(editingProduct?.price || "");
  const [category, setCategory] = useState(editingProduct?.category || "");
  const [quantity, setQuantity] = useState(editingProduct?.quantity || "");
  const [unit, setUnit] = useState(editingProduct?.unit || "");
  const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(
  editingProduct?.imageUrl?.startsWith("http")
    ? editingProduct.imageUrl
    : `https://farmconnect-by0t.onrender.com/${editingProduct?.imageUrl || ""}`
);
   

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    // Create a URL for the image file for preview
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (editingProduct) formData.append("id", editingProduct._id);
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("unit", unit);
    formData.append("productImage", imageFile);

    try {
      const response = await fetch("https://farmconnect-by0t.onrender.com/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      alert(data.success ? (editingProduct ? "Product updated successfully!" : "Product added successfully!") : `Failed to process product: ${data.message}`);
      navigate('/farmer-dashboard')
    } catch (error) {
      console.error("Error processing product:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
<>
    <FarmerNavBar
    onOrdersClick={handleOrders} 
    onSellClick={handleSellProducts} 
    onLogout={handleLogout} 
/>
    <div className="product-selling-page-container">
      <div className="product-selling-form">
        <form onSubmit={handleSubmit}>
          <h2>{editingProduct ? "Edit Your Product" : "Sell Your Product"}</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Product Name:</label>
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Price (₹):</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>

            <div className="form-group">
  <label>Category:</label>
  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
    <option value="">Select Category</option>
    <option value="fruits">Fruits</option>
    <option value="vegetables">Vegetables</option>
    <option value="grains">Grains</option>
  </select>
</div>


            <div className="form-group">
              <label>Available Quantity:</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Unit:</label>
              <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Product Image:</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
             {imagePreview && (
  <div className="image-preview">
    <img src={imagePreview} alt="Preview" />
  </div>
)}

            </div>
          </div>

     

          <button type="submit" className="submit-button">{editingProduct ? "Update Product" : "Submit Product"}</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default ProductSellingPage;
