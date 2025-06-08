const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/jwtUtils');
const mongoose = require('mongoose');

// FAQ responses
const faqResponses = {
    'where is my order': async (userId) => {
        try {
            const Order = mongoose.model('Order');
            const orders = await Order.find({ buyerId: userId })
                .sort({ createdAt: -1 })
                .limit(1);
            
            if (orders.length === 0) {
                return "You don't have any orders yet.";
            }

            const latestOrder = orders[0];
            return `Your latest order (Order #${latestOrder._id}) is currently ${latestOrder.status}. 
                    You can view all your orders in the "Your Orders" section.`;
        } catch (error) {
            console.error('Error fetching order:', error);
            return "I'm having trouble checking your order status. Please try again later.";
        }
    },
    'refund': "To request a refund, please go to the 'Your Orders' section, select the order you want to refund, and click on 'Request Refund'. Our team will review your request within 24-48 hours.",
    'track delivery': "You can track your delivery in the 'Your Orders' section. Click on the order you want to track, and you'll see the delivery status and tracking information if available.",
    'payment methods': "We accept all major credit cards, debit cards, and UPI payments. For more details, please visit our payment methods page.",
    'delivery time': "Standard delivery time is 2-3 business days. Express delivery is available for an additional fee.",
    'contact support': "You can contact our support team through email at support@farmconnect.com or call us at 1-800-FARM-CONNECT.",
    'default': "I'm not sure about that. Please try asking a different question or contact our support team for assistance."
};

router.post('/api/buyer/faq', authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!req.user || !req.user.buyerId) {
            return res.status(403).json({ error: 'Authentication required' });
        }

        const userId = req.user.buyerId;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const lowerMessage = message.toLowerCase();
        let response = faqResponses.default;

        // Check for order status
        if (lowerMessage.includes('where is my order') || lowerMessage.includes('order status')) {
            response = await faqResponses['where is my order'](userId);
        }
        // Check for refund
        else if (lowerMessage.includes('refund')) {
            response = faqResponses.refund;
        }
        // Check for delivery tracking
        else if (lowerMessage.includes('track') || lowerMessage.includes('delivery')) {
            response = faqResponses['track delivery'];
        }
        // Check for payment methods
        else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
            response = faqResponses['payment methods'];
        }
        // Check for delivery time
        else if (lowerMessage.includes('delivery time') || lowerMessage.includes('when will it arrive')) {
            response = faqResponses['delivery time'];
        }
        // Check for contact support
        else if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
            response = faqResponses['contact support'];
        }

        res.json({ response });
    } catch (error) {
        console.error('Error in FAQ endpoint:', error);
        res.status(500).json({ 
            error: 'Failed to process FAQ request',
            details: error.message 
        });
    }
});

module.exports = router; 