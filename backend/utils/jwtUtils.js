// In a new file, e.g., jwtUtils.js
const jwt = require('jsonwebtoken');

const secretKey = 'farmconnect'; // Replace with your own secret key

// Generate a JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
};

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Store user info in request
        next();
    });
};

module.exports = { generateToken, authenticateToken };
