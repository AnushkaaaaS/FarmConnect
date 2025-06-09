import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './ProductSellingPage.css';
import FarmerNavBar from "./FarmerNavBar";
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const translations = {
  en: {
    title: "Sell Your Product",
    editTitle: "Edit Your Product",
    productName: "Product Name:",
    description: "Description:",
    price: "Price (₹):",
    category: "Category:",
    selectCategory: "Select Category",
    fruits: "Fruits",
    vegetables: "Vegetables",
    grains: "Grains",
    millets: "Millets",
    subtype: "Subtype (Optional):",
    // subtypePlaceholder: "e.g., Organic, Local, Premium",
    quantity: "Available Quantity:",
    unit: "Unit:",
    productImage: "Product Image:",
    submitButton: "Submit Product",
    updateButton: "Update Product",
    successMessage: "Product added successfully!",
    updateSuccessMessage: "Product updated successfully!",
    errorMessage: "Failed to process product:",
    generalError: "An error occurred:"
  },
  mr: {
    title: "तुमचे उत्पादन विका",
    editTitle: "तुमचे उत्पादन संपादित करा",
    productName: "उत्पादनाचे नाव:",
    description: "वर्णन:",
    price: "किंमत (₹):",
    category: "श्रेणी:",
    selectCategory: "श्रेणी निवडा",
    fruits: "फळे",
    vegetables: "भाज्या",
    grains: "धान्ये",
    millets: "ज्वारी",
    subtype: "उपप्रकार (वैकल्पिक):",
    // subtypePlaceholder: "उदा., जैविक, स्थानिक, प्रीमियम",
    quantity: "उपलब्ध प्रमाण:",
    unit: "एकक:",
    productImage: "उत्पादनाचे चित्र:",
    submitButton: "उत्पादन सबमिट करा",
    updateButton: "उत्पादन अपडेट करा",
    successMessage: "उत्पादन यशस्वीरित्या जोडले!",
    updateSuccessMessage: "उत्पादन यशस्वीरित्या अपडेट केले!",
    errorMessage: "उत्पादन प्रक्रिया करण्यात अयशस्वी:",
    generalError: "एक त्रुटी आली:"
  },
  hi: {
    title: "अपना उत्पाद बेचें",
    editTitle: "अपना उत्पाद संपादित करें",
    productName: "उत्पाद का नाम:",
    description: "विवरण:",
    price: "कीमत (₹):",
    category: "श्रेणी:",
    selectCategory: "श्रेणी चुनें",
    fruits: "फल",
    vegetables: "सब्जियां",
    grains: "अनाज",
    millets: "बाजरा",
    subtype: "उपप्रकार (वैकल्पिक):",
    // subtypePlaceholder: "जैसे, जैविक, स्थानिक, प्रीमियम",
    quantity: "उपलब्ध मात्रा:",
    unit: "इकाई:",
    productImage: "उत्पाद की छवि:",
    submitButton: "उत्पाद जमा करें",
    updateButton: "उत्पाद अपडेट करें",
    successMessage: "उत्पाद सफलतापूर्वक जोड़ा गया!",
    updateSuccessMessage: "उत्पाद सफलतापूर्वक अपडेट किया गया!",
    errorMessage: "उत्पाद प्रोसेस करने में विफल:",
    generalError: "एक त्रुटि हुई:"
  }
};

function ProductSellingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingProduct = location.state?.product || null;
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const handleLogout = () => {
    navigate('/');
  };

  const handleOrders = () => {
    navigate('/farmer-orders');
  };

  const handleSellProducts = () => {
    navigate('/sell');
  };

  const [productName, setProductName] = useState(editingProduct?.name || "");
  const [description, setDescription] = useState(editingProduct?.description || "");
  const [price, setPrice] = useState(editingProduct?.price || "");
  const [category, setCategory] = useState(editingProduct?.category || "");
  const [subtype, setSubtype] = useState(editingProduct?.subtype || "");
  const [quantity, setQuantity] = useState(editingProduct?.quantity || "");
  const [unit, setUnit] = useState(editingProduct?.unit || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingProduct?.imageUrl || "");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
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
    formData.append("subtype", subtype);
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
      alert(data.success ? (editingProduct ? t.updateSuccessMessage : t.successMessage) : `${t.errorMessage} ${data.message}`);
      navigate('/farmer-dashboard')
    } catch (error) {
      console.error("Error processing product:", error);
      alert(`${t.generalError} ${error.message}`);
    }
  };

  return (
    <>
      <FarmerNavBar
        onOrdersClick={handleOrders}
        onSellClick={handleSellProducts}
        onLogout={handleLogout}
      />
      <LanguageSelector />
      <div className="product-selling-page-container">
        <div className="product-selling-form">
          <form onSubmit={handleSubmit}>
            <h2>{editingProduct ? t.editTitle : t.title}</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>{t.productName}</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>{t.description}</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>{t.price}</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>{t.category}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">{t.selectCategory}</option>
                  <option value="fruits">{t.fruits}</option>
                  <option value="vegetables">{t.vegetables}</option>
                  <option value="grains">{t.grains}</option>
                  <option value="millets">{t.millets}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.subtype}</label>
                <input
                  type="text"
                  value={subtype}
                  onChange={(e) => setSubtype(e.target.value)}
                  placeholder={t.subtypePlaceholder}
                />
              </div>

              <div className="form-group">
                <label>{t.quantity}</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>{t.unit}</label>
                <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>{t.productImage}</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="submit-button">
              {editingProduct ? t.updateButton : t.submitButton}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProductSellingPage;
