import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './FarmingToolsPage.css';
import FarmerNavBar from './FarmerNavBar';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const translations = {
  en: {
    title: "Farming Tools",
    shopNow: "Shop Now",
    off: "OFF",
    originalPrice: "Original Price",
    discountedPrice: "Discounted Price",
    description: "Description",
    name: "Name",
    products: {
      handTrowel: {
        name: "Hand Trowel",
        description: "Perfect for planting and weeding."
      },
      gardenFork: {
        name: "Garden Fork",
        description: "Ideal for soil aeration and turning."
      },
      pruningShears: {
        name: "Pruning Shears",
        description: "Sharp and precise cutting tool."
      },
      wateringCan: {
        name: "Watering Can",
        description: "Efficient water distribution."
      },
      gardenRake: {
        name: "Garden Rake",
        description: "Perfect for soil leveling."
      },
      plantLabels: {
        name: "Plant Labels",
        description: "Organize your garden plants."
      },
      gardenGloves: {
        name: "Garden Gloves",
        description: "Protect your hands while gardening."
      },
      soilPhMeter: {
        name: "Soil pH Meter",
        description: "Measure soil acidity levels."
      },
      seedlingTray: {
        name: "Seedling Tray",
        description: "Tray with multiple cells for seed starting."
      }
    }
  },
  mr: {
    title: "शेती साधने",
    shopNow: "आता खरेदी करा",
    off: "सूट",
    originalPrice: "मूळ किंमत",
    discountedPrice: "सवलतीची किंमत",
    description: "वर्णन",
    name: "नाव",
    products: {
      handTrowel: {
        name: "हाताची खुरपी",
        description: "रोपण आणि तण काढण्यासाठी उत्तम."
      },
      gardenFork: {
        name: "बाग काटा",
        description: "माती वायुवीजन आणि पलटण्यासाठी आदर्श."
      },
      pruningShears: {
        name: "काटण्याची कात्री",
        description: "तीक्ष्ण आणि अचूक कापण्याचे साधन."
      },
      wateringCan: {
        name: "पाणी घालण्याचे कॅन",
        description: "कार्यक्षम पाणी वितरण."
      },
      gardenRake: {
        name: "बाग काडी",
        description: "माती समतल करण्यासाठी उत्तम."
      },
      plantLabels: {
        name: "वनस्पती लेबल्स",
        description: "तुमच्या बागेतील वनस्पती व्यवस्थित करा."
      },
      gardenGloves: {
        name: "बाग हातमोजे",
        description: "बागकाम करताना हातांचे रक्षण करा."
      },
      soilPhMeter: {
        name: "माती pH मीटर",
        description: "मातीची आम्लता पातळी मोजा."
      },
      seedlingTray: {
        name: "रोपण ट्रे",
        description: "बीज रोपणासाठी अनेक पेशी असलेली ट्रे."
      }
    }
  },
  hi: {
    title: "कृषि उपकरण",
    shopNow: "अभी खरीदें",
    off: "छूट",
    originalPrice: "वास्तविक कीमत",
    discountedPrice: "छूट की कीमत",
    description: "विवरण",
    name: "नाम",
    products: {
      handTrowel: {
        name: "हैंड ट्रोवेल",
        description: "रोपण और निराई के लिए एकदम सही."
      },
      gardenFork: {
        name: "गार्डन फोर्क",
        description: "मिट्टी की हवा और पलटने के लिए आदर्श."
      },
      pruningShears: {
        name: "प्रूनिंग शीयर्स",
        description: "तेज और सटीक काटने का उपकरण."
      },
      wateringCan: {
        name: "वॉटरिंग कैन",
        description: "कुशल जल वितरण."
      },
      gardenRake: {
        name: "गार्डन रेक",
        description: "मिट्टी समतल करने के लिए एकदम सही."
      },
      plantLabels: {
        name: "प्लांट लेबल्स",
        description: "अपने बगीचे के पौधों को व्यवस्थित करें."
      },
      gardenGloves: {
        name: "गार्डन ग्लव्स",
        description: "बागवानी करते समय हाथों की सुरक्षा करें."
      },
      soilPhMeter: {
        name: "सॉइल pH मीटर",
        description: "मिट्टी की अम्लता स्तर मापें."
      },
      seedlingTray: {
        name: "सीडलिंग ट्रे",
        description: "बीज रोपण के लिए कई कोशिकाओं वाली ट्रे."
      }
    }
  }
};

// Sample product data with original and discounted prices in rupees
const products = [
    {
      id: 1,
      key: "handTrowel",
      originalPrice: 500,
      discountedPrice: 400,
      image: "/handtrowel.jpeg",
    },
    {
      id: 2,
      key: "gardenFork",
      originalPrice: 800,
      discountedPrice: 650,
      image: "/gardenfork.jpeg",
    },
    {
      id: 3,
      key: "pruningShears",
      originalPrice: 1200,
      discountedPrice: 950,
      image: "/pruningshears.jpeg",
    },
    {
      id: 4,
      key: "wateringCan",
      originalPrice: 600,
      discountedPrice: 450,
      image: "/wateringcan.jpeg",
    },
    {
      id: 5,
      key: "gardenRake",
      originalPrice: 700,
      discountedPrice: 550,
      image: "/gardenrake.jpeg",
    },
    {
      id: 6,
      key: "plantLabels",
      originalPrice: 200,
      discountedPrice: 150,
      image: "/plantlabels.jpeg",
    },
    {
      id: 7,
      key: "gardenGloves",
      originalPrice: 400,
      discountedPrice: 300,
      image: "/gardengloves.jpeg",
    },
    {
      id: 8,
      key: "soilPhMeter",
      originalPrice: 900,
      discountedPrice: 750,
      image: "/soilphmeter.jpeg",
    },
    {
      id: 9,
      key: "seedlingTray",
      originalPrice: 300,
      discountedPrice: 250,
      image: "/seedlingtray.jpeg",
    },
  ];
  

// Calculate discount percentage
const calculateDiscountPercentage = (original, discounted) => {
  return Math.round(((original - discounted) / original) * 100);
};

function FarmingToolsPage() {
  const navigate = useNavigate();
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

  return (<>
    <FarmerNavBar 
    onOrdersClick={handleOrders} 
    onSellClick={handleSellProducts} 
    onLogout={handleLogout} 
/>
    <LanguageSelector />
    <div className="product-page">
      <h1>{t.title}</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={t.products[product.key].name} className="product-image" />
            <h3 className="product-name">{t.name}: {t.products[product.key].name}</h3>
            <p className="product-description">{t.description}: {t.products[product.key].description}</p>
            <div className="product-price-container">
              <p className="original-price">{t.originalPrice}: ₹{product.originalPrice.toLocaleString()}</p>
              <p className="discounted-price">{t.discountedPrice}: ₹{product.discountedPrice.toLocaleString()}</p>
              <p className="discount-percentage">
                {calculateDiscountPercentage(product.originalPrice, product.discountedPrice)}% {t.off}
              </p>
            </div>
            <button className="shop-now-button">{t.shopNow}</button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default FarmingToolsPage;

