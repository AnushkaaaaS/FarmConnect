import React, { useState, useRef, useEffect } from 'react';
import './FarmerChatbot.css';

const FarmerChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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

        const userMessage = inputMessage.trim();
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setInputMessage('');
        setIsLoading(true);
        setError(null);

        try {
            console.log('Sending message to backend:', userMessage);
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    context: "You are an agricultural expert AI assistant. Provide helpful advice about farming, crop management, weather conditions, and best practices. Keep responses concise and practical."
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to get response');
            }

            const data = await response.json();
            console.log('Received response from backend:', data);
            setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
        } catch (error) {
            console.error('Detailed error:', error);
            setError(error.message);
            setMessages(prev => [...prev, { 
                text: `Error: ${error.message}. Please try again later.`, 
                sender: 'bot' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3>Farming Assistant</h3>
                <p>Ask me anything about farming, crops, or agricultural practices</p>
            </div>
            <div className="chatbot-messages">
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
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="chatbot-input">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about farming..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default FarmerChatbot; 