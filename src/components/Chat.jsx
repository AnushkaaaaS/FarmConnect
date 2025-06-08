import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import { fetchFromApi } from '../api'; // ✅ Import your API utility

const Chat = ({ userType, userId, userName }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_API_URL); // ✅ dynamic socket URL
        setSocket(newSocket);

        newSocket.emit('join', { userId, userType });

        newSocket.on('onlineUsers', (users) => {
            setOnlineUsers(users);
        });

        newSocket.on('message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        fetchPreviousMessages();

        return () => newSocket.close();
    }, [userId, userType]);

    const fetchPreviousMessages = async () => {
        try {
            const response = await fetchFromApi(`/api/messages/${userId}`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchUserMessages = async (otherUserId) => {
        try {
            const response = await fetchFromApi(`/api/messages/${userId}/${otherUserId}`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching user messages:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedUser) return;

        const messageData = {
            sender: userId,
            receiver: selectedUser.id,
            text: message,
            timestamp: new Date(),
            senderType: userType,
            receiverType: selectedUser.type
        };

        socket.emit('message', messageData);
        setMessage('');
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const selectUser = (user) => {
        setSelectedUser(user);
        fetchUserMessages(user.id);
    };

    return (
        <div className="chat-wrapper">
            {!isOpen && (
                <button className="chat-toggle" onClick={toggleChat}>
                    {userType === 'farmer' ? 'बायर्स से चैट करें' : 'फार्मर्स से चैट करें'}
                </button>
            )}
            {isOpen && (
                <div className="chat-container">
                    <div className="chat-header">
                        <h3>{userType === 'farmer' ? 'बायर्स से चैट' : 'फार्मर्स से चैट'}</h3>
                        <button className="close-button" onClick={toggleChat}>×</button>
                    </div>
                    <div className="chat-sidebar">
                        <div className="online-users">
                            <h4>ऑनलाइन उपयोगकर्ता</h4>
                            {onlineUsers
                                .filter(user => user.id !== userId && user.type !== userType)
                                .map(user => (
                                    <div
                                        key={user.id}
                                        className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                                        onClick={() => selectUser(user)}
                                    >
                                        <span className="user-name">{user.name}</span>
                                        <span className="online-indicator"></span>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="chat-main">
                        {selectedUser ? (
                            <>
                                <div className="chat-messages">
                                    {messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`message ${msg.sender === userId ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-content">
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={sendMessage} className="chat-input">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="संदेश लिखें..."
                                        disabled={!selectedUser}
                                    />
                                    <button type="submit" disabled={!message.trim() || !selectedUser}>
                                        भेजें
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="no-chat-selected">
                                <p>चैट शुरू करने के लिए एक उपयोगकर्ता चुनें</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
