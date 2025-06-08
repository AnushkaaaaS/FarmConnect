const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/farmconnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Message Schema
const messageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    text: String,
    timestamp: Date,
    senderType: String,
    receiverType: String
});

const Message = mongoose.model('Message', messageSchema);

// Store online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle user joining
    socket.on('join', ({ userId, userType }) => {
        onlineUsers.set(userId, {
            id: userId,
            type: userType,
            socketId: socket.id
        });
        io.emit('onlineUsers', Array.from(onlineUsers.values()));
    });

    // Handle new messages
    socket.on('message', async (messageData) => {
        try {
            // Save message to database
            const message = new Message(messageData);
            await message.save();

            // Emit message to receiver if online
            const receiver = onlineUsers.get(messageData.receiver);
            if (receiver) {
                io.to(receiver.socketId).emit('message', messageData);
            }

            // Emit message back to sender
            socket.emit('message', messageData);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        for (const [userId, user] of onlineUsers.entries()) {
            if (user.socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        io.emit('onlineUsers', Array.from(onlineUsers.values()));
    });
});

// API endpoints for fetching messages
app.get('/api/messages/:userId', async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.params.userId },
                { receiver: req.params.userId }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

app.get('/api/messages/:userId/:otherUserId', async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.params.userId, receiver: req.params.otherUserId },
                { sender: req.params.otherUserId, receiver: req.params.userId }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
}); 