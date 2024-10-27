
import React, { useState } from "react";
import './ProductSellingPage.css';

function ProductSellingPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState(""); // New field for kg/dozen
  const [imageFile, setImageFile] = useState(null);
  
  // State for farmer details
  const [farmerDetails, setFarmerDetails] = useState({
    farmerName: "",
    location: "",
    totalArea: "",
    areaUnderCultivation: "",
    cropCycle: "",
    agricultureMethod: "",
  });

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);  // Store image file
  };

  const handleFarmerDetailsChange = (e) => {
    const { name, value } = e.target;
    setFarmerDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("unit", unit);  // Append unit (kg or dozen)
    formData.append("productImage", imageFile);  // Append image file
    formData.append("farmerDetails", JSON.stringify(farmerDetails)); // Append farmer details as string

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,  // Send form data
      });
      const data = await response.json();
      if (data.success) {
        alert("Product added successfully!");
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="product-selling-page-container">
      <div className="form-container">
        <form className="product-selling-form" onSubmit={handleSubmit}>
          <h2>Sell Your Product</h2>

          <label>Product Name:</label>
          <input
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />

          <label>Description:</label>
          <textarea
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Price (in ₹):</label>
          <input
            type="number"
            placeholder="Enter product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="grains">Grains</option>
          </select>

          <label>Quantity:</label>
          <input
            type="number"
            placeholder="Enter available quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <label>Unit:</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          >
            <option value="">Select Unit</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="dozen">Dozen</option>
          </select>

          <label>Upload Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />

          <button type="submit" className="submit-button">
            Submit Product
          </button>
        </form>

        <form className="farmer-details-form">
          <h2>Farmer Details</h2>

          <label>Farmer Name:</label>
          <input
            type="text"
            name="farmerName"
            placeholder="Enter farmer name"
            value={farmerDetails.farmerName}
            onChange={handleFarmerDetailsChange}
            required
          />

          <label>Location:</label>
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={farmerDetails.location}
            onChange={handleFarmerDetailsChange}
            required
          />

          <label>Total Area:</label>
          <input
            type="text"
            name="totalArea"
            placeholder="Enter total area"
            value={farmerDetails.totalArea}
            onChange={handleFarmerDetailsChange}
            required
          />

          <label>Area Under Cultivation:</label>
          <input
            type="text"
            name="areaUnderCultivation"
            placeholder="Enter area under cultivation"
            value={farmerDetails.areaUnderCultivation}
            onChange={handleFarmerDetailsChange}
            required
          />

          <label>Crop Cycle:</label>
          <input
            type="text"
            name="cropCycle"
            placeholder="Enter crop cycle"
            value={farmerDetails.cropCycle}
            onChange={handleFarmerDetailsChange}
            required
          />

          <label>Agriculture Method:</label>
          <input
            type="text"
            name="agricultureMethod"
            placeholder="Enter agriculture method"
            value={farmerDetails.agricultureMethod}
            onChange={handleFarmerDetailsChange}
            required
          />
        </form>
      </div>
    </div>
  );
}

export default ProductSellingPage;
