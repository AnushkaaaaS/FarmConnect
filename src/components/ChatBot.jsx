import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState('hindi');
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize Gemini API with environment variable
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = getSpeechRecognitionLanguage();

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputMessage(prev => prev + ' ' + transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                setError(language === 'hindi' ? 'ध्वनि पहचान में त्रुटि' : 
                         language === 'marathi' ? 'ध्वनी ओळख त्रुटी' : 
                         'Speech recognition error');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            console.warn('Speech recognition not supported');
            setError(language === 'hindi' ? 'आपका ब्राउज़र ध्वनि पहचान का समर्थन नहीं करता' : 
                     language === 'marathi' ? 'तुमचा ब्राउझर ध्वनी ओळखण्यास समर्थन देत नाही' : 
                     'Your browser does not support speech recognition');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [language]);

    const getSpeechRecognitionLanguage = () => {
        switch(language) {
            case 'hindi':
                return 'hi-IN';
            case 'marathi':
                return 'mr-IN';
            default:
                return 'en-US';
        }
    };

    const toggleSpeechRecognition = () => {
        if (!isListening) {
            setIsListening(true);
            recognitionRef.current.lang = getSpeechRecognitionLanguage();
            recognitionRef.current.start();
        } else {
            setIsListening(false);
            recognitionRef.current.stop();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const formatResponse = (text) => {
        // Add markdown formatting
        let formattedText = text
            // Format section headers
            .replace(/(\d+\.\s*[^:]+):/g, '### $1\n')
            // Format lists
            .replace(/•\s/g, '- ')
            // Format important points
            .replace(/(Important|Note|Tip|Warning):/g, '**$1:**')
            // Add bold to key terms
            .replace(/(Best practices|Common problems|Solutions|Steps|Requirements):/g, '**$1:**')
            // Format technical terms
            .replace(/`([^`]+)`/g, '**$1**');

        return formattedText;
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setIsLoading(true);
        setError(null);

        try {
            if (!API_KEY) {
                throw new Error('API key not found. Please check your environment variables.');
            }

            // First, get the response in English
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `As an agricultural expert, please help with this farming-related query: "${userMessage}". 
                Provide a detailed and practical response using the following format:

                ### Overview:
                [Provide a brief overview]

                ### Detailed Information:
                [Main explanation with key points in bold]

                ### Step-by-step Guide:
                1. [First step]
                2. [Second step]
                ...

                ### Best Practices:
                - [Practice 1]
                - [Practice 2]
                ...

                ### Common Challenges and Solutions:
                **Challenge 1:**
                - Solution: [Explanation]

                **Challenge 2:**
                - Solution: [Explanation]

                ### Additional Tips:
                - [Tip 1]
                - [Tip 2]
                ...

                Use markdown formatting for better readability. Make important terms bold using ** **.`
            });
            
            const englishText = response.text;

            // If language is not English, translate the response
            if (language !== 'english') {
                const translationResponse = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: `Translate this farming advice to ${language}, keeping the technical terms in English where appropriate. Maintain the markdown formatting (###, -, **, etc.) in the translation: "${englishText}"`
                });
                const translatedText = translationResponse.text;
                setMessages(prev => [...prev, { text: formatResponse(translatedText), sender: 'bot' }]);
            } else {
                setMessages(prev => [...prev, { text: formatResponse(englishText), sender: 'bot' }]);
            }
        } catch (error) {
            console.error('Detailed error:', error);
            setError(`Error: ${error.message}`);
            const errorMessage = language === 'hindi' 
                ? "क्षमा करें, मैं AI सेवा से जुड़ने में समस्या का सामना कर रहा हूं। कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।"
                : language === 'marathi'
                ? "क्षमस्व, मला AI सेवेशी जोडण्यात समस्या येत आहे. कृपया आपले इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा."
                : "I apologize, but I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
            setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getPlaceholderText = () => {
        switch(language) {
            case 'hindi':
                return "कृषि से संबंधित कोई भी प्रश्न पूछें...";
            case 'marathi':
                return "शेतीसंबंधी कोणताही प्रश्न विचारा...";
            default:
                return "Ask any farming-related question...";
        }
    };

    return (
        <div className="chatbot-wrapper">
            {!isOpen && (
                <button className="chatbot-toggle" onClick={toggleChat}>
                    {language === 'hindi' ? 'कृषि सहायक से बात करें' :
                     language === 'marathi' ? 'शेती सहाय्यकाशी बोला' :
                     'Talk to Farming Assistant'}
                </button>
            )}
            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <h3>{language === 'hindi' ? 'कृषि सहायक' : 
                             language === 'marathi' ? 'शेती सहाय्यक' :
                             'Farming Assistant'}</h3>
                        <div className="language-selector">
                            <select value={language} onChange={handleLanguageChange}>
                                <option value="hindi">हिंदी</option>
                                <option value="marathi">मराठी</option>
                                <option value="english">English</option>
                            </select>
                        </div>
                        <p>{language === 'hindi' ? 'कृषि के बारे में कोई भी प्रश्न पूछें!' :
                            language === 'marathi' ? 'शेतीबद्दल कोणताही प्रश्न विचारा!' :
                            'Ask me anything about farming!'}</p>
                        <button className="close-button" onClick={toggleChat}>×</button>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender}`}>
                                <div className="message-content">
                                    {message.sender === 'bot' ? (
                                        <ReactMarkdown>{message.text}</ReactMarkdown>
                                    ) : (
                                        message.text
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot">
                                <div className="message-content loading">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="chatbot-input">
                        <div className="input-container">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder={getPlaceholderText()}
                                disabled={isLoading}
                            />
                            <button 
                                type="button" 
                                className={`voice-button ${isListening ? 'listening' : ''}`}
                                onClick={toggleSpeechRecognition}
                                disabled={isLoading}
                                title={language === 'hindi' ? 'ध्वनि इनपुट' : 
                                       language === 'marathi' ? 'ध्वनी इनपुट' : 
                                       'Voice input'}
                            >
                                {isListening ? (
                                    <span className="pulse-animation">🎙️</span>
                                ) : (
                                    '🎤'
                                )}
                            </button>
                        </div>
                        <button type="submit" disabled={isLoading}>
                            {language === 'hindi' ? 'भेजें' :
                             language === 'marathi' ? 'पाठवा' :
                             'Send'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;