# FarmConnect Chat Server

This is the real-time chat server for the FarmConnect platform, enabling direct communication between farmers and buyers.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Setup Instructions

1. Install dependencies:
```bash
cd server
npm install
```

2. Make sure MongoDB is running on your system. The server expects MongoDB to be running on the default port (27017).

3. Start the chat server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Features

- Real-time messaging between farmers and buyers
- Message persistence in MongoDB
- Online user tracking
- Message history retrieval
- Support for multiple languages (Hindi, English, Marathi)

## API Endpoints

### Messages

- `GET /api/messages/:userId` - Get all messages for a user
- `GET /api/messages/:userId/:otherUserId` - Get messages between two users

## Socket Events

### Client to Server
- `join` - Join the chat room with user details
- `message` - Send a new message

### Server to Client
- `onlineUsers` - List of currently online users
- `message` - New message received

## Environment Variables

The server uses the following environment variables:

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string (default: mongodb://localhost:27017/farmconnect)

## Security

- Messages are stored securely in MongoDB
- Socket connections are authenticated using JWT tokens
- CORS is enabled for the frontend application

## Error Handling

The server includes comprehensive error handling for:
- Database connection issues
- Invalid message formats
- Authentication failures
- Socket connection errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 