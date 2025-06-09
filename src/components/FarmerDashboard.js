import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerNavBar from './FarmerNavBar';
import './FarmerDashboard.css';
import aboutImage from '../assets/farmer.jpg';
import subscriptionImage from '../assets/subscription-image.png';
import Footer from './Footer';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import ChatBot from './ChatBot';

const translations = {
  en: {
    heroTitle: "Empowering Farmers, Connecting You to Your Market",
    heroDescription: "Sell your produce, connect with buyers, and grow your business with FarmConnect.",
    getStarted: "Get Started",
    subscriptionTitle: "Exclusive Access to Best Deals on Farming Tools!",
    subscriptionDescription: "As a FarmConnect subscriber, you can access exclusive discounts and offers on high-quality farming tools. Whether you're looking to enhance your productivity or get the best deals on essential equipment, our platform ensures you get the most value for your investment.",
    exploreTools: "Explore Farming Tools Now",
    dashboardCategories: "Dashboard Categories",
    sellProduce: {
      title: "Sell Your Produce",
      description: "Connect directly with buyers and sell your fresh produce with ease.",
      button: "Go to Sell"
    },
    yourProducts: {
      title: "Your Products",
      description: "Manage and showcase your products effectively to attract customers.",
      button: "View Products"
    },
    yourOrders: {
      title: "Your Orders",
      description: "Keep track of all your orders and streamline your sales process.",
      button: "View Orders"
    },
    aboutUs: {
      title: "About Us",
      description: "At FarmConnect, we empower farmers to directly connect with consumers, enhancing their market reach. Our platform ensures that your high-quality agricultural products are easily accessible, enabling you to grow your business while providing fresh produce to your community."
    },
    subscription: {
      title: "Join Our Subscription Plan",
      description: "Unlock exclusive benefits to maximize your farming potential!",
      benefits: [
        "Gain access to a wealth of discounted farming resources and tools.",
        "Be featured on top for increased visibility.",
        "Receive real-time alerts on market trends and price fluctuations.",
        "Connect with fellow farmers to share experiences and strategies for success."
      ],
      button: "Subscribe Now"
    }
  },
  mr: {
    heroTitle: "शेतकऱ्यांना सक्षम करणे, तुम्हाला तुमच्या बाजारपेठेशी जोडणे",
    heroDescription: "तुमची उत्पादने विका, खरेदीदारांशी जोडा आणि FarmConnect सह तुमचा व्यवसाय वाढवा.",
    getStarted: "प्रारंभ करा",
    subscriptionTitle: "शेती साधनांवर सर्वोत्तम सौद्यांसाठी विशेष प्रवेश!",
    subscriptionDescription: "FarmConnect सदस्य म्हणून, तुम्ही उच्च गुणवत्तेच्या शेती साधनांवर विशेष सूट आणि ऑफर मिळवू शकता. तुम्ही तुमची उत्पादकता वाढवू इच्छित असाल किंवा आवश्यक उपकरणांवर सर्वोत्तम सौदे मिळवू इच्छित असाल, आमचे प्लॅटफॉर्म तुम्हाला तुमच्या गुंतवणुकीवर सर्वोत्तम मूल्य मिळवण्यासाठी सुनिश्चित करते.",
    exploreTools: "आता शेती साधने एक्सप्लोर करा",
    dashboardCategories: "डॅशबोर्ड श्रेणी",
    sellProduce: {
      title: "तुमची उत्पादने विका",
      description: "खरेदीदारांशी थेट जोडा आणि तुमची ताजी उत्पादने सहजपणे विका.",
      button: "विक्रीकडे जा"
    },
    yourProducts: {
      title: "तुमची उत्पादने",
      description: "तुमची उत्पादने प्रभावीपणे व्यवस्थापित करा आणि ग्राहकांना आकर्षित करा.",
      button: "उत्पादने पहा"
    },
    yourOrders: {
      title: "तुमचे ऑर्डर",
      description: "तुमचे सर्व ऑर्डर ट्रॅक करा आणि तुमची विक्री प्रक्रिया सुधारा.",
      button: "ऑर्डर पहा"
    },
    aboutUs: {
      title: "आमच्याबद्दल",
      description: "FarmConnect मध्ये, आम्ही शेतकऱ्यांना थेट ग्राहकांशी जोडून त्यांचा बाजारपेठेचा विस्तार वाढवण्यासाठी सक्षम करतो. आमचे प्लॅटफॉर्म सुनिश्चित करते की तुमची उच्च गुणवत्तेची कृषी उत्पादने सहजपणे उपलब्ध आहेत, ज्यामुळे तुम्ही तुमचा व्यवसाय वाढवू शकता आणि तुमच्या समुदायाला ताजी उत्पादने पुरवू शकता."
    },
    subscription: {
      title: "आमच्या सबस्क्रिप्शन प्लॅनमध्ये सामील व्हा",
      description: "तुमची शेती क्षमता वाढवण्यासाठी विशेष लाभ मिळवा!",
      benefits: [
        "तुमची उत्पादकता वाढवण्यासाठी सवलतीच्या शेती संसाधनां, साधनां आणि टिप्सचा मोठा संग्रह मिळवा.",
        "वाढीव दृश्यमानता आणि खरेदीदारांना तुमची उत्पादने दाखवण्यासाठी टॉपवर फीचर व्हा.",
        "बाजारातील ट्रेंड आणि किंमतीतील चढउतारांबद्दल रीअल-टाइम अलर्ट मिळवा.",
        "अनुभव आणि यशस्वी होण्यासाठीच्या रणनीती शेअर करण्यासाठी इतर शेतकऱ्यांशी जोडा."
      ],
      button: "आता सबस्क्राईब करा"
    }
  },
  hi: {
    heroTitle: "किसानों को सशक्त बनाना, आपको आपके बाजार से जोड़ना",
    heroDescription: "अपनी उपज बेचें, खरीदारों से जुड़ें, और FarmConnect के साथ अपना व्यवसाय बढ़ाएं।",
    getStarted: "शुरू करें",
    subscriptionTitle: "कृषि उपकरणों पर सर्वोत्तम सौदों के लिए विशेष पहुंच!",
    subscriptionDescription: "FarmConnect सदस्य के रूप में, आप उच्च गुणवत्ता वाले कृषि उपकरणों पर विशेष छूट और ऑफर प्राप्त कर सकते हैं। चाहे आप अपनी उत्पादकता बढ़ाना चाहते हैं या आवश्यक उपकरणों पर सर्वोत्तम सौदे प्राप्त करना चाहते हैं, हमारा प्लेटफॉर्म आपको आपके निवेश पर सर्वोत्तम मूल्य प्राप्त करने में सुनिश्चित करता है।",
    exploreTools: "अभी कृषि उपकरण एक्सप्लोर करें",
    dashboardCategories: "डैशबोर्ड श्रेणियां",
    sellProduce: {
      title: "अपनी उपज बेचें",
      description: "खरीदारों से सीधे जुड़ें और अपनी ताजी उपज आसानी से बेचें।",
      button: "बिक्री पर जाएं"
    },
    yourProducts: {
      title: "आपके उत्पाद",
      description: "अपने उत्पादों को प्रभावी ढंग से प्रबंधित करें और ग्राहकों को आकर्षित करें।",
      button: "उत्पाद देखें"
    },
    yourOrders: {
      title: "आपके ऑर्डर",
      description: "अपने सभी ऑर्डर को ट्रैक करें और अपनी बिक्री प्रक्रिया को सुव्यवस्थित करें।",
      button: "ऑर्डर देखें"
    },
    aboutUs: {
      title: "हमारे बारे में",
      description: "FarmConnect में, हम किसानों को सीधे उपभोक्ताओं से जोड़कर उनकी बाजार पहुंच बढ़ाने में सक्षम बनाते हैं। हमारा प्लेटफॉर्म सुनिश्चित करता है कि आपकी उच्च गुणवत्ता वाली कृषि उपज आसानी से उपलब्ध है, जिससे आप अपना व्यवसाय बढ़ा सकते हैं और अपने समुदाय को ताजी उपज प्रदान कर सकते हैं।"
    },
    subscription: {
      title: "हमारी सदस्यता योजना में शामिल हों",
      description: "अपनी कृषि क्षमता को अधिकतम करने के लिए विशेष लाभ प्राप्त करें!",
      benefits: [
        "अपनी उत्पादकता बढ़ाने के लिए कृषि संसाधनों, उपकरणों और टिप्स की भरमार तक पहुंच प्राप्त करें।",
        "बढ़ी हुई दृश्यता और खरीदारों को अपने उत्पाद दिखाने के लिए शीर्ष पर फीचर हों।",
        "बाजार के रुझान और कीमतों में उतार-चढ़ाव पर रीयल-टाइम अलर्ट प्राप्त करें।",
        "अनुभव और सफलता की रणनीतियों को साझा करने के लिए अन्य किसानों से जुड़ें।"
      ],
      button: "अभी सदस्यता लें"
    }
  }
};

const FarmerDashboard = () => {
    const navigate = useNavigate();
    const salesAnalyticsRef = useRef(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage];

    useEffect(() => {
        const fetchFarmerSubscriptionStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }
        
                const response = await fetch('https://farmconnect-by0t.onrender.com/api/farmer/status', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
        
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    throw new Error(errorData.message || 'Network response was not ok');
                }
        
                const data = await response.json();
                setIsSubscribed(data.is_subscribed);
            } catch (error) {
                console.error('Error fetching subscription status:', error);
            }
        };

        fetchFarmerSubscriptionStatus();
    }, []);

    const handleLogout = () => {
        navigate('/');
    };

    const handleOrders = () => {
        navigate('/farmer-orders');
    };

    const handleSellProducts = () => {
        navigate('/sell');
    };

    const handleShopNowClick = () => {
        if (salesAnalyticsRef.current) {
            salesAnalyticsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleViewProducts = () => {
        navigate('/your-products');
    };

    const handleViewFarmingTools = () => {
        navigate('/farming-tools-page');
    };

    return (
        <>
        <div className="dashboard-container">
            <FarmerNavBar 
                onOrdersClick={handleOrders} 
                onSellClick={handleSellProducts} 
                onLogout={handleLogout} 
            />
            <LanguageSelector />

            <div className="hero-section">
                <div className="hero-content">
                    <h1>{t.heroTitle}</h1>
                    <p>{t.heroDescription}</p>
                    <button className="shop-now-btn" onClick={handleShopNowClick}>{t.getStarted}</button>
                </div>
            </div>
            
            {isSubscribed && (
                <div className="subscription-benefits-section">
                    <div className="benefits-content">
                        <h2>{t.subscriptionTitle}</h2>
                        <p>{t.subscriptionDescription}</p>
                        <button className="view-tools-btn" onClick={handleViewFarmingTools}>
                            {t.exploreTools}
                        </button>
                    </div>
                </div>
            )}

            <div className="featured-categories" ref={salesAnalyticsRef}>
                <h2>{t.dashboardCategories}</h2>
                <div className="categories-container">
                    <div className="category">
                        <h3>{t.sellProduce.title}</h3>
                        <p>{t.sellProduce.description}</p>
                        <button onClick={handleSellProducts} className="go-to-sell-btn">{t.sellProduce.button}</button>
                    </div>
                    <div className="category">
                        <h3>{t.yourProducts.title}</h3>
                        <p>{t.yourProducts.description}</p>
                        <button onClick={handleViewProducts} className="view-products-btn">{t.yourProducts.button}</button>
                    </div>
                    <div className="category">
                        <h3>{t.yourOrders.title}</h3>
                        <p>{t.yourOrders.description}</p>
                        <button onClick={handleOrders} className="view-orders-btn">{t.yourOrders.button}</button>
                    </div>
                </div>
            </div>

            <div className="about-us-section">
                <div className="about-us-content">
                    <h2>{t.aboutUs.title}</h2>
                    <p><b>{t.aboutUs.description}</b></p>
                </div>
                <img src={aboutImage} alt="About Us" className="about-us-image" />
            </div>

            {!isSubscribed && (
               <div className="subscription-section">
               <div className="subscription-content">
                   <div className="subscription-image">
                       <img src={subscriptionImage} alt="Subscription Benefits" />
                   </div>
                   <div className="subscription-text">
                       <h2>{t.subscription.title}</h2>
                       <p>{t.subscription.description}</p>
                       <ul className="subscription-benefits">
                           {t.subscription.benefits.map((benefit, index) => (
                               <li key={index}><b>{benefit}</b></li>
                           ))}
                       </ul>
                       <button onClick={() => { navigate("/subscription-form-farmer"); }} className="subscribe-btn">{t.subscription.button}</button>
                   </div>
               </div>
           </div>
            )}
        </div>
        <Footer />
        <ChatBot />
        </>
    );
};

export default FarmerDashboard;
