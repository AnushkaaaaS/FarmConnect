import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuyerFAQChatbot.css';

const BuyerFAQChatbot = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFollowUp, setShowFollowUp] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setMessages(prev => [...prev, { 
                text: "Please log in to use the chatbot.", 
                sender: 'bot' 
            }]);
            return;
        }

        const userMessage = inputMessage.trim();
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setInputMessage('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/buyer/faq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMessage
                }),
            });

            if (!response.ok) {
                if (response.status === 403) {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    setMessages(prev => [...prev, { 
                        text: "Your session has expired. Please log in again.", 
                        sender: 'bot' 
                    }]);
                    navigate('/');
                    return;
                }
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
            
            // Show follow-up question after a short delay
            setTimeout(() => {
                setShowFollowUp(true);
                setMessages(prev => [...prev, { 
                    text: "Is your query resolved? If not, would you like to connect with a farmer directly?", 
                    sender: 'bot' 
                }]);
            }, 1000);
        } catch (error) {
            console.error('Detailed error:', error);
            setError(error.message);
            setMessages(prev => [...prev, { 
                text: "I'm having trouble processing your request. Please try again later.", 
                sender: 'bot' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFollowUpResponse = (response) => {
        setShowFollowUp(false);
        if (response === 'no') {
            setMessages(prev => [...prev, { 
                text: "I understand. Would you like to connect with a farmer directly? They can provide more specific assistance.", 
                sender: 'bot' 
            }]);
        } else {
            setMessages(prev => [...prev, { 
                text: "Great! Is there anything else I can help you with?", 
                sender: 'bot' 
            }]);
        }
    };

    return (
        <div className="faq-chatbot-wrapper">
            {!isOpen ? (
                <button 
                    className="faq-chatbot-toggle"
                    onClick={() => setIsOpen(true)}
                >
                    <span className="faq-icon">?</span>
                    <span className="faq-label">Need Help?</span>
                </button>
            ) : (
                <div className="faq-chatbot-container">
                    <div className="faq-chatbot-header">
                        <h3>Buyer Support</h3>
                        <p>How can we help you today?</p>
                        <button 
                            className="close-button"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>
                    </div>
                    <div className="faq-chatbot-messages">
                        {messages.length === 0 && (
                            <div className="faq-suggestions">
                                <p>Common questions:</p>
                                <button onClick={() => setInputMessage("Where is my order?")}>
                                    Where is my order?
                                </button>
                                <button onClick={() => setInputMessage("How do I request a refund?")}>
                                    How do I request a refund?
                                </button>
                                <button onClick={() => setInputMessage("How do I track my delivery?")}>
                                    How do I track my delivery?
                                </button>
                                <button onClick={() => setInputMessage("What payment methods do you accept?")}>
                                    What payment methods do you accept?
                                </button>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender}`}>
                                <div className="message-content">
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot">
                                <div className="message-content loading">
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="message bot error">
                                <div className="message-content">
                                    {error}
                                </div>
                            </div>
                        )}
                        {showFollowUp && (
                            <div className="follow-up-buttons">
                                <button onClick={() => handleFollowUpResponse('yes')}>
                                    Yes, my query is resolved
                                </button>
                                <button onClick={() => handleFollowUpResponse('no')}>
                                    No, I need more help
                                </button>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="faq-chatbot-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BuyerFAQChatbot; 