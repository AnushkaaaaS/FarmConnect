const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Received chat request:', { message, context });
        
        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Create a chat session
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: context || "You are an agricultural expert AI assistant. Provide helpful advice about farming, crop management, weather conditions, and best practices. Keep responses concise and practical.",
                },
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
        });

        // Send message and get response
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        console.log('Chat response:', text);
        res.json({ response: text });
    } catch (error) {
        console.error('Detailed error in chat endpoint:', error);
        res.status(500).json({ 
            error: 'Failed to process chat request',
            details: error.message 
        });
    }
});

module.exports = router; 