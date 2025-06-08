import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faHandHoldingUsd, faBook, faTractor, faFileAlt, faInfoCircle, faCheckCircle, faExclamationTriangle, faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import FarmerNavBar from './FarmerNavBar';
import './ResourceHubPage.css';

const ResourceHubPage = () => {
    const [activeTab, setActiveTab] = useState('schemes');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = (item, type) => {
        setSelectedItem({ ...item, type });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const schemes = [
        {
            title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
            description: "Direct income support of ₹6,000 per year to all landholding farmer families.",
            eligibility: "All landholding farmer families",
            benefits: [
                "₹6,000 per year in three equal installments",
                "Direct transfer to bank accounts",
                "No middlemen involved",
                "Helps meet agricultural expenses",
                "Additional benefits for organic farming",
                "Special provisions for women farmers"
            ],
            documents: [
                "Aadhaar card",
                "Land documents",
                "Bank account details",
                "Recent photograph",
                "Income certificate",
                "Caste certificate (if applicable)"
            ],
            howToApply: [
                "Visit nearest Common Service Centre (CSC)",
                "Submit Aadhaar card and land documents",
                "Fill PM-KISAN form",
                "Get registered for direct benefit transfer",
                "Verify details through OTP",
                "Receive confirmation message"
            ],
            importantNotes: [
                "No application fee required",
                "Update bank account details if changed",
                "Check beneficiary status online",
                "Contact helpline for assistance",
                "Annual renewal required",
                "Special provisions for differently-abled farmers"
            ],
            link: "https://pmkisan.gov.in/"
        },
        {
            title: "Kisan Credit Card (KCC)",
            description: "Credit card for farmers to meet their agricultural needs with interest subvention.",
            eligibility: "All farmers including tenant farmers, sharecroppers",
            benefits: [
                "Interest subvention of 2%",
                "Additional 3% for timely repayment",
                "Flexible credit limit",
                "Insurance coverage",
                "No processing fee",
                "Emergency credit facility",
                "Crop insurance coverage"
            ],
            documents: [
                "Land documents",
                "ID proof",
                "Bank account details",
                "Recent photograph",
                "Crop details",
                "Income proof",
                "Property documents"
            ],
            howToApply: [
                "Visit nearest bank branch",
                "Submit land documents and ID proof",
                "Fill KCC application form",
                "Get credit card within 2 weeks",
                "Complete KYC verification",
                "Link with Aadhaar",
                "Set up mobile banking"
            ],
            importantNotes: [
                "No processing fee",
                "Insurance coverage included",
                "Flexible repayment options",
                "Can be used at ATMs",
                "Emergency credit available",
                "Annual renewal required",
                "Special provisions for women farmers"
            ],
            link: "https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12345"
        },
        {
            title: "PM Fasal Bima Yojana",
            description: "Crop insurance scheme to protect farmers against crop failure.",
            eligibility: "All farmers growing notified crops",
            benefits: [
                "Comprehensive crop insurance",
                "Low premium rates",
                "Quick claim settlement",
                "Coverage for natural disasters",
                "Prevented sowing coverage",
                "Post-harvest losses coverage",
                "Localized calamity coverage"
            ],
            documents: [
                "Land documents",
                "Crop details",
                "Bank account details",
                "ID proof",
                "Sowing certificate",
                "Previous crop records",
                "Bank passbook"
            ],
            howToApply: [
                "Contact nearest insurance company",
                "Submit crop details and land documents",
                "Pay premium",
                "Get insurance certificate",
                "Register for SMS alerts",
                "Link with bank account",
                "Complete verification process"
            ],
            importantNotes: [
                "Premium varies by crop",
                "Government subsidy on premium",
                "Claims settled within 2 weeks",
                "Coverage for all major risks",
                "Special provisions for organic farming",
                "Additional coverage for natural disasters",
                "Regular updates required"
            ],
            link: "https://pmfby.gov.in/"
        },
        {
            title: "National Agriculture Market (eNAM)",
            description: "Electronic trading platform for agricultural commodities.",
            eligibility: "All registered farmers and traders",
            benefits: [
                "Better price discovery",
                "Reduced transaction costs",
                "Transparent trading",
                "Quality testing facilities",
                "Online payment system",
                "Real-time price updates",
                "Market linkage"
            ],
            documents: [
                "Aadhaar card",
                "Bank account details",
                "Land documents",
                "Recent photograph",
                "Mobile number",
                "Email ID",
                "PAN card (for traders)"
            ],
            howToApply: [
                "Visit nearest APMC market",
                "Register on eNAM portal",
                "Complete KYC verification",
                "Link bank account",
                "Get trading ID",
                "Complete training",
                "Start trading"
            ],
            importantNotes: [
                "No registration fee",
                "Mandatory quality testing",
                "Real-time price updates",
                "Secure payment system",
                "24/7 support available",
                "Regular updates required",
                "Special provisions for small farmers"
            ],
            link: "https://enam.gov.in/"
        },
        {
            title: "National Mission for Sustainable Agriculture (NMSA)",
            description: "Promotes sustainable agriculture practices and climate-resilient farming.",
            eligibility: "All farmers practicing sustainable agriculture",
            benefits: [
                "Subsidy for organic farming inputs",
                "Support for water conservation",
                "Training in sustainable practices",
                "Financial assistance for equipment",
                "Soil health management support",
                "Climate-resilient farming guidance"
            ],
            documents: [
                "Land ownership proof",
                "Aadhaar card",
                "Bank account details",
                "Soil test report",
                "Crop plan",
                "Previous farming records"
            ],
            howToApply: [
                "Contact nearest Krishi Vikas Kendra",
                "Submit application with documents",
                "Attend training sessions",
                "Implement recommended practices",
                "Get verification visit",
                "Receive assistance"
            ],
            importantNotes: [
                "Focus on sustainable practices",
                "Regular monitoring required",
                "Documentation of practices needed",
                "Follow-up visits mandatory",
                "Annual renewal required",
                "Special focus on water conservation"
            ],
            link: "https://nmsa.dac.gov.in/"
        },
        {
            title: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
            description: "Ensures access to irrigation water for every farm field.",
            eligibility: "Farmers with land holdings",
            benefits: [
                "Micro-irrigation support",
                "Water conservation structures",
                "Drip irrigation systems",
                "Sprinkler irrigation",
                "Water storage solutions",
                "Training in water management"
            ],
            documents: [
                "Land documents",
                "Aadhaar card",
                "Bank account details",
                "Water source details",
                "Soil test report",
                "Crop plan"
            ],
            howToApply: [
                "Visit nearest agriculture office",
                "Submit application form",
                "Get site inspection",
                "Receive technical guidance",
                "Installation of systems",
                "Final verification"
            ],
            importantNotes: [
                "Water source required",
                "Regular maintenance needed",
                "Training provided",
                "Subsidy varies by system",
                "Quality certification required",
                "Follow-up visits mandatory"
            ],
            link: "https://pmksy.gov.in/"
        }
    ];

    const subsidies = [
        {
            title: "Subsidy on Agricultural Machinery",
            description: "Up to 40% subsidy on purchase of agricultural machinery and equipment.",
            eligibleItems: [
                {
                    name: "Tractors",
                    subsidy: "40% up to ₹60,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details"]
                },
                {
                    name: "Harvesters",
                    subsidy: "40% up to ₹2,00,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details"]
                },
                {
                    name: "Seed drills",
                    subsidy: "40% up to ₹30,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details"]
                },
                {
                    name: "Sprayers",
                    subsidy: "40% up to ₹15,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details"]
                },
                {
                    name: "Solar pumps",
                    subsidy: "60% up to ₹50,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details"]
                },
                {
                    name: "Drip irrigation systems",
                    subsidy: "50% up to ₹40,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details"]
                }
            ],
            howToApply: [
                "Select machinery from approved list",
                "Submit application to agriculture department",
                "Get approval and purchase machinery",
                "Claim subsidy with bills",
                "Complete verification process",
                "Submit bank details",
                "Receive subsidy amount"
            ],
            importantNotes: [
                "Subsidy varies by equipment type",
                "Maximum subsidy limits apply",
                "Bank loan required for most items",
                "Original bills required for claim",
                "Regular maintenance required",
                "Insurance coverage mandatory",
                "Training provided for operation"
            ],
            link: "https://agricoop.gov.in/"
        },
        {
            title: "Subsidy on Seeds and Fertilizers",
            description: "Subsidy on certified seeds and fertilizers for better crop yield.",
            eligibleItems: [
                {
                    name: "Certified seeds",
                    subsidy: "50% up to ₹5,000 per hectare",
                    requirements: ["Land ownership proof", "Crop plan", "Soil test report", "Bank account details"]
                },
                {
                    name: "Bio-fertilizers",
                    subsidy: "75% up to ₹3,000 per hectare",
                    requirements: ["Land ownership proof", "Soil test report", "Organic farming certificate", "Bank account details"]
                },
                {
                    name: "Organic fertilizers",
                    subsidy: "50% up to ₹2,000 per hectare",
                    requirements: ["Land ownership proof", "Organic farming certificate", "Soil test report", "Bank account details"]
                },
                {
                    name: "Hybrid seeds",
                    subsidy: "40% up to ₹4,000 per hectare",
                    requirements: ["Land ownership proof", "Crop plan", "Soil test report", "Bank account details"]
                },
                {
                    name: "Micro-nutrients",
                    subsidy: "60% up to ₹1,500 per hectare",
                    requirements: ["Land ownership proof", "Soil test report", "Crop plan", "Bank account details"]
                }
            ],
            howToApply: [
                "Visit nearest Krishi Vikas Kendra",
                "Submit land documents",
                "Get subsidy voucher",
                "Purchase from authorized dealers",
                "Submit purchase proof",
                "Complete verification",
                "Receive subsidy amount"
            ],
            importantNotes: [
                "Subsidy varies by product",
                "Maximum limits per hectare",
                "Only for certified products",
                "Original receipts required",
                "Regular soil testing needed",
                "Quality certification required",
                "Special provisions for organic farming"
            ],
            link: "https://www.fertilizer.org/"
        },
        {
            title: "Subsidy on Greenhouses",
            description: "Financial support for setting up greenhouses and polyhouses.",
            eligibleItems: [
                {
                    name: "Polyhouse",
                    subsidy: "50% up to ₹1,00,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details", "Technical feasibility report"]
                },
                {
                    name: "Greenhouse",
                    subsidy: "60% up to ₹1,50,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details", "Technical feasibility report"]
                },
                {
                    name: "Shade net house",
                    subsidy: "40% up to ₹50,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details", "Technical feasibility report"]
                }
            ],
            howToApply: [
                "Get technical feasibility report",
                "Submit application with documents",
                "Get site inspection",
                "Receive approval",
                "Install greenhouse",
                "Claim subsidy"
            ],
            importantNotes: [
                "Technical guidance provided",
                "Regular maintenance required",
                "Training mandatory",
                "Quality standards must be met",
                "Insurance coverage required",
                "Follow-up visits mandatory"
            ],
            link: "https://agricoop.gov.in/"
        },
        {
            title: "Subsidy on Cold Storage",
            description: "Financial assistance for setting up cold storage facilities.",
            eligibleItems: [
                {
                    name: "Cold storage unit",
                    subsidy: "40% up to ₹2,00,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details", "Technical feasibility report"]
                },
                {
                    name: "Cold room",
                    subsidy: "35% up to ₹1,50,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details", "Technical feasibility report"]
                },
                {
                    name: "Refrigeration unit",
                    subsidy: "30% up to ₹1,00,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details", "Technical feasibility report"]
                }
            ],
            howToApply: [
                "Get technical feasibility report",
                "Submit application with documents",
                "Get site inspection",
                "Receive approval",
                "Install cold storage",
                "Claim subsidy"
            ],
            importantNotes: [
                "Technical guidance provided",
                "Regular maintenance required",
                "Training mandatory",
                "Quality standards must be met",
                "Insurance coverage required",
                "Follow-up visits mandatory"
            ],
            link: "https://agricoop.gov.in/"
        },
        {
            title: "Subsidy on Farm Equipment",
            description: "Financial support for purchasing modern farm equipment.",
            eligibleItems: [
                {
                    name: "Combine harvester",
                    subsidy: "40% up to ₹3,00,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details", "Technical feasibility report"]
                },
                {
                    name: "Thresher",
                    subsidy: "35% up to ₹50,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details"]
                },
                {
                    name: "Power tiller",
                    subsidy: "40% up to ₹40,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details"]
                }
            ],
            howToApply: [
                "Select equipment from approved list",
                "Submit application with documents",
                "Get technical evaluation",
                "Receive approval",
                "Purchase equipment",
                "Claim subsidy"
            ],
            importantNotes: [
                "Technical guidance provided",
                "Regular maintenance required",
                "Training mandatory",
                "Quality standards must be met",
                "Insurance coverage required",
                "Follow-up visits mandatory"
            ],
            link: "https://agricoop.gov.in/"
        },
        {
            title: "Subsidy on Farm Infrastructure",
            description: "Support for developing farm infrastructure and storage facilities.",
            eligibleItems: [
                {
                    name: "Warehouse",
                    subsidy: "40% up to ₹5,00,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details", "Technical feasibility report"]
                },
                {
                    name: "Grain storage",
                    subsidy: "35% up to ₹2,00,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details", "Technical feasibility report"]
                },
                {
                    name: "Processing unit",
                    subsidy: "40% up to ₹3,00,000",
                    requirements: ["Land ownership proof", "Bank loan sanction", "Aadhaar card", "Bank account details", "Technical feasibility report"]
                }
            ],
            howToApply: [
                "Get technical feasibility report",
                "Submit application with documents",
                "Get site inspection",
                "Receive approval",
                "Construct infrastructure",
                "Claim subsidy"
            ],
            importantNotes: [
                "Technical guidance provided",
                "Regular maintenance required",
                "Training mandatory",
                "Quality standards must be met",
                "Insurance coverage required",
                "Follow-up visits mandatory"
            ],
            link: "https://agricoop.gov.in/"
        }
    ];

    const grants = [
        {
            title: "Startup India Agriculture Grant",
            description: "Financial support for agricultural startups and innovations.",
            eligibility: "Agri-tech startups and innovators",
            benefits: [
                "Up to ₹25 lakh grant",
                "Mentorship support",
                "Technical guidance",
                "Market linkage",
                "Training programs",
                "Networking opportunities"
            ],
            documents: [
                "Business plan",
                "Innovation details",
                "Team credentials",
                "Financial projections",
                "Market analysis",
                "Technical feasibility report"
            ],
            howToApply: [
                "Register on Startup India portal",
                "Submit detailed proposal",
                "Get technical evaluation",
                "Present to selection committee",
                "Receive approval",
                "Get grant disbursement"
            ],
            importantNotes: [
                "Innovation focus required",
                "Regular progress reports needed",
                "Milestone tracking mandatory",
                "Audit requirements",
                "IP protection guidance",
                "Market validation required"
            ],
            link: "https://www.startupindia.gov.in/"
        },
        {
            title: "Agri-Export Grant",
            description: "Support for farmers and organizations involved in agricultural exports.",
            eligibility: "Farmers and organizations exporting agricultural products",
            benefits: [
                "Export infrastructure support",
                "Quality certification assistance",
                "Market development support",
                "Training programs",
                "Logistics support",
                "Brand development"
            ],
            documents: [
                "Export registration",
                "Business plan",
                "Market analysis",
                "Product details",
                "Quality certificates",
                "Financial statements"
            ],
            howToApply: [
                "Register as exporter",
                "Submit proposal",
                "Get technical evaluation",
                "Receive approval",
                "Implement plan",
                "Claim benefits"
            ],
            importantNotes: [
                "Export focus required",
                "Quality standards must be met",
                "Regular reporting needed",
                "Market compliance required",
                "Documentation mandatory",
                "Follow-up visits required"
            ],
            link: "https://apeda.gov.in/"
        },
        {
            title: "Organic Farming Grant",
            description: "Financial support for transitioning to organic farming.",
            eligibility: "Farmers practicing or transitioning to organic farming",
            benefits: [
                "Certification support",
                "Input assistance",
                "Training programs",
                "Market linkage",
                "Infrastructure support",
                "Technical guidance"
            ],
            documents: [
                "Land ownership proof",
                "Organic farming plan",
                "Soil test report",
                "Previous farming records",
                "Market linkage proof",
                "Training certificates"
            ],
            howToApply: [
                "Contact organic farming department",
                "Submit application",
                "Get field inspection",
                "Receive approval",
                "Implement organic practices",
                "Get certification"
            ],
            importantNotes: [
                "Organic standards must be met",
                "Regular inspection required",
                "Documentation mandatory",
                "Training attendance required",
                "Quality testing needed",
                "Follow-up visits mandatory"
            ],
            link: "https://organic.icar.gov.in/"
        }
    ];

    const farmingTips = [
        {
            category: "Soil Health",
            tips: [
                {
                    title: "Regular Soil Testing",
                    description: "Test soil every 3 years to maintain optimal pH and nutrient levels",
                    frequency: "Every 3 years",
                    importance: "High",
                    additionalInfo: "Use government-approved soil testing labs for accurate results"
                },
                {
                    title: "Organic Matter Management",
                    description: "Use organic manure and compost to improve soil structure",
                    frequency: "Seasonally",
                    importance: "High",
                    additionalInfo: "Mix different types of organic matter for better results"
                },
                {
                    title: "Crop Rotation",
                    description: "Practice crop rotation to prevent soil nutrient depletion",
                    frequency: "Annually",
                    importance: "Medium",
                    additionalInfo: "Plan rotation based on nutrient requirements of different crops"
                },
                {
                    title: "pH Level Maintenance",
                    description: "Maintain proper pH levels for optimal nutrient availability",
                    frequency: "As needed",
                    importance: "High",
                    additionalInfo: "Use lime or sulfur to adjust pH levels"
                },
                {
                    title: "Cover Cropping",
                    description: "Plant cover crops to prevent soil erosion and improve fertility",
                    frequency: "Between main crops",
                    importance: "Medium",
                    additionalInfo: "Choose cover crops based on your main crop requirements"
                },
                {
                    title: "Mulching",
                    description: "Use organic mulch to maintain soil moisture and temperature",
                    frequency: "Seasonally",
                    importance: "Medium",
                    additionalInfo: "Use locally available materials for mulching"
                }
            ]
        },
        {
            category: "Water Management",
            tips: [
                {
                    title: "Drip Irrigation",
                    description: "Implement drip irrigation for efficient water usage",
                    frequency: "Daily",
                    importance: "High",
                    additionalInfo: "Regular maintenance of drip lines is essential"
                },
                {
                    title: "Mulching",
                    description: "Use mulching techniques to reduce water evaporation",
                    frequency: "Seasonally",
                    importance: "Medium",
                    additionalInfo: "Combine with drip irrigation for best results"
                },
                {
                    title: "Rainwater Harvesting",
                    description: "Harvest rainwater for sustainable water management",
                    frequency: "Yearly",
                    importance: "High",
                    additionalInfo: "Regular cleaning of storage tanks is important"
                },
                {
                    title: "Irrigation Scheduling",
                    description: "Schedule irrigation based on crop needs and weather",
                    frequency: "Daily",
                    importance: "High",
                    additionalInfo: "Use soil moisture sensors for accurate scheduling"
                },
                {
                    title: "Water Quality Testing",
                    description: "Regular testing of irrigation water quality",
                    frequency: "Quarterly",
                    importance: "Medium",
                    additionalInfo: "Check for pH, salinity, and contaminants"
                },
                {
                    title: "Conservation Tillage",
                    description: "Practice conservation tillage to retain soil moisture",
                    frequency: "Seasonally",
                    importance: "Medium",
                    additionalInfo: "Use appropriate equipment for minimum tillage"
                }
            ]
        },
        {
            category: "Pest Management",
            tips: [
                {
                    title: "Integrated Pest Management",
                    description: "Use IPM techniques for sustainable pest control",
                    frequency: "As needed",
                    importance: "High",
                    additionalInfo: "Combine multiple control methods for better results"
                },
                {
                    title: "Resistant Varieties",
                    description: "Plant pest-resistant crop varieties",
                    frequency: "Seasonally",
                    importance: "Medium",
                    additionalInfo: "Choose varieties based on local pest pressure"
                },
                {
                    title: "Crop Spacing",
                    description: "Maintain proper spacing between crops",
                    frequency: "During planting",
                    importance: "Medium",
                    additionalInfo: "Follow recommended spacing for each crop"
                },
                {
                    title: "Natural Repellents",
                    description: "Use natural pest repellents and biological controls",
                    frequency: "As needed",
                    importance: "Medium",
                    additionalInfo: "Prepare natural repellents from local materials"
                },
                {
                    title: "Pest Monitoring",
                    description: "Regular monitoring of pest populations",
                    frequency: "Weekly",
                    importance: "High",
                    additionalInfo: "Use pheromone traps for monitoring"
                },
                {
                    title: "Sanitation Practices",
                    description: "Maintain field sanitation to prevent pest buildup",
                    frequency: "Regularly",
                    importance: "Medium",
                    additionalInfo: "Remove crop residues and weeds regularly"
                }
            ]
        }
    ];

    const marketInfo = [
        {
            title: "Market Prices",
            description: "Real-time prices for major crops in your region",
            features: [
                "Daily price updates",
                "Regional price variations",
                "Historical price trends",
                "Price alerts",
                "Market demand analysis",
                "Export prices",
                "Local market rates"
            ],
            source: "Agmarknet Portal",
            link: "https://agmarknet.gov.in/"
        },
        {
            title: "Weather Forecast",
            description: "Accurate weather predictions for better farming decisions",
            features: [
                "7-day forecast",
                "Rainfall predictions",
                "Temperature trends",
                "Weather alerts",
                "Humidity levels",
                "Wind speed data",
                "UV index information"
            ],
            source: "IMD Weather Portal",
            link: "https://mausam.imd.gov.in/"
        },
        {
            title: "Best Practices",
            description: "Latest farming techniques and research findings",
            features: [
                "Research updates",
                "Expert recommendations",
                "Case studies",
                "Training materials",
                "Success stories",
                "Innovation guides",
                "Technology adoption tips"
            ],
            source: "ICAR Knowledge Portal",
            link: "https://icar.org.in/"
        },
        {
            title: "Market Demand",
            description: "Current market demand and future projections",
            features: [
                "Demand forecasts",
                "Supply analysis",
                "Price trends",
                "Export opportunities",
                "Local market insights",
                "Consumer preferences",
                "Seasonal variations"
            ],
            source: "Agricultural Marketing Portal",
            link: "https://agmarknet.gov.in/"
        }
    ];

    const renderModalContent = () => {
        if (!selectedItem) return null;

        switch (selectedItem.type) {
            case 'scheme':
                return (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{selectedItem.title}</h2>
                            <button className="close-button" onClick={closeModal}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faCheckCircle} /> Eligibility</h4>
                                <p>{selectedItem.eligibility}</p>
                            </div>

                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faHandHoldingUsd} /> Benefits</h4>
                                <ul>
                                    {selectedItem.benefits.map((benefit, i) => (
                                        <li key={i}>{benefit}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faFileAlt} /> Required Documents</h4>
                                <ul>
                                    {selectedItem.documents.map((doc, i) => (
                                        <li key={i}>{doc}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faInfoCircle} /> How to Apply</h4>
                                <ol>
                                    {selectedItem.howToApply.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>

                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faExclamationTriangle} /> Important Notes</h4>
                                <ul>
                                    {selectedItem.importantNotes.map((note, i) => (
                                        <li key={i}>{note}</li>
                                    ))}
                                </ul>
                            </div>

                            <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" className="apply-link">
                                Apply Now <FontAwesomeIcon icon={faFileAlt} />
                            </a>
                        </div>
                    </div>
                );

            case 'subsidy':
                return (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{selectedItem.title}</h2>
                            <button className="close-button" onClick={closeModal}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faCheckCircle} /> Eligible Items</h4>
                                <div className="eligible-items">
                                    {selectedItem.eligibleItems.map((item, i) => (
                                        <div key={i} className="eligible-item">
                                            <h5>{item.name}</h5>
                                            <p className="subsidy-amount">{item.subsidy}</p>
                                            <h6>Requirements:</h6>
                                            <ul>
                                                {item.requirements.map((req, j) => (
                                                    <li key={j}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faInfoCircle} /> How to Apply</h4>
                                <ol>
                                    {selectedItem.howToApply.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>

                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faExclamationTriangle} /> Important Notes</h4>
                                <ul>
                                    {selectedItem.importantNotes.map((note, i) => (
                                        <li key={i}>{note}</li>
                                    ))}
                                </ul>
                            </div>

                            <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" className="apply-link">
                                Learn More <FontAwesomeIcon icon={faFileAlt} />
                            </a>
                        </div>
                    </div>
                );

            case 'tips':
                return (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{selectedItem.category}</h2>
                            <button className="close-button" onClick={closeModal}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="tips-grid">
                                {selectedItem.tips.map((tip, i) => (
                                    <div key={i} className="tip-item">
                                        <h4>{tip.title}</h4>
                                        <p>{tip.description}</p>
                                        <div className="tip-meta">
                                            <span className="frequency">
                                                <FontAwesomeIcon icon={faInfoCircle} /> Frequency: {tip.frequency}
                                            </span>
                                            <span className={`importance ${tip.importance.toLowerCase()}`}>
                                                <FontAwesomeIcon icon={faExclamationTriangle} /> Importance: {tip.importance}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'market':
                return (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{selectedItem.title}</h2>
                            <button className="close-button" onClick={closeModal}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="features-section">
                                <h4>Features</h4>
                                <ul>
                                    {selectedItem.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="source-section">
                                <p>Source: {selectedItem.source}</p>
                                <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" className="market-link">
                                    Visit Portal <FontAwesomeIcon icon={faFileAlt} />
                                </a>
                            </div>
                        </div>
                    </div>
                );

            case 'grant':
                return (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{selectedItem.title}</h2>
                            <button className="close-button" onClick={closeModal}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faCheckCircle} /> Eligibility</h4>
                                <p>{selectedItem.eligibility}</p>
                            </div>

                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faHandHoldingUsd} /> Benefits</h4>
                                <ul>
                                    {selectedItem.benefits.map((benefit, i) => (
                                        <li key={i}>{benefit}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faFileAlt} /> Required Documents</h4>
                                <ul>
                                    {selectedItem.documents.map((doc, i) => (
                                        <li key={i}>{doc}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faInfoCircle} /> How to Apply</h4>
                                <ol>
                                    {selectedItem.howToApply.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>

                            <div className="detail-section">
                                <h4><FontAwesomeIcon icon={faExclamationTriangle} /> Important Notes</h4>
                                <ul>
                                    {selectedItem.importantNotes.map((note, i) => (
                                        <li key={i}>{note}</li>
                                    ))}
                                </ul>
                            </div>

                            <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" className="apply-link">
                                Apply Now <FontAwesomeIcon icon={faFileAlt} />
                            </a>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="resource-hub-page">
            <FarmerNavBar />
            <div className="resource-hub-content">
                <h1>Farmer Resource Hub</h1>
                
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'schemes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schemes')}
                    >
                        <FontAwesomeIcon icon={faHandHoldingUsd} /> Government Schemes
                    </button>
                    <button 
                        className={`tab ${activeTab === 'subsidies' ? 'active' : ''}`}
                        onClick={() => setActiveTab('subsidies')}
                    >
                        <FontAwesomeIcon icon={faSeedling} /> Subsidies
                    </button>
                    <button 
                        className={`tab ${activeTab === 'grants' ? 'active' : ''}`}
                        onClick={() => setActiveTab('grants')}
                    >
                        <FontAwesomeIcon icon={faHandHoldingUsd} /> Government Grants
                    </button>
                    <button 
                        className={`tab ${activeTab === 'tips' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tips')}
                    >
                        <FontAwesomeIcon icon={faTractor} /> Farming Tips
                    </button>
                    <button 
                        className={`tab ${activeTab === 'market' ? 'active' : ''}`}
                        onClick={() => setActiveTab('market')}
                    >
                        <FontAwesomeIcon icon={faBook} /> Market Information
                    </button>
                </div>

                <div className="content">
                    {activeTab === 'schemes' && (
                        <div className="schemes-container">
                            {schemes.map((scheme, index) => (
                                <div key={index} className="scheme-card">
                                    <h3>{scheme.title}</h3>
                                    <p className="description">{scheme.description}</p>
                                    <button 
                                        className="view-details-button"
                                        onClick={() => openModal(scheme, 'scheme')}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'subsidies' && (
                        <div className="subsidies-container">
                            {subsidies.map((subsidy, index) => (
                                <div key={index} className="subsidy-card">
                                    <h3>{subsidy.title}</h3>
                                    <p className="description">{subsidy.description}</p>
                                    <button 
                                        className="view-details-button"
                                        onClick={() => openModal(subsidy, 'subsidy')}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'grants' && (
                        <div className="grants-container">
                            {grants.map((grant, index) => (
                                <div key={index} className="grant-card">
                                    <h3>{grant.title}</h3>
                                    <p className="description">{grant.description}</p>
                                    <button 
                                        className="view-details-button"
                                        onClick={() => openModal(grant, 'grant')}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'tips' && (
                        <div className="tips-container">
                            {farmingTips.map((category, index) => (
                                <div key={index} className="tips-card">
                                    <h3>{category.category}</h3>
                                    <button 
                                        className="view-details-button"
                                        onClick={() => openModal(category, 'tips')}
                                    >
                                        View Tips
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'market' && (
                        <div className="market-container">
                            {marketInfo.map((info, index) => (
                                <div key={index} className="market-card">
                                    <h3>{info.title}</h3>
                                    <p className="description">{info.description}</p>
                                    <button 
                                        className="view-details-button"
                                        onClick={() => openModal(info, 'market')}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    {renderModalContent()}
                </div>
            )}
        </div>
    );
};

export default ResourceHubPage; 