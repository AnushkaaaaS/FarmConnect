import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import './ChatBot.css';

const CropChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState('hindi');
    const messagesEndRef = useRef(null);

    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setIsLoading(true);

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `Provide detailed farming advice on: "${userMessage}" focusing on crop growth, diseases, and yield improvement. Use markdown for formatting.`
            });
            
            const reply = response.text;
            setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { text: 'AI service unavailable. Try again later.', sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <h3>Crop Assistance</h3>
            <div className="chatbot-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="chatbot-input">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about any crop..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>Send</button>
            </form>
        </div>
    );
};

export default CropChatBot;
