const jwt = require('jsonwebtoken');

const secretKey = 'farmconnect_farmer'; // Unique secret key for farmers

// Generate a JWT token specifically for farmers
const generateFarmerToken = (farmerId,role='farmer') => {
    return jwt.sign({ farmerId, role}, secretKey, { expiresIn: '1h' });
};

// Middleware to authenticate farmer token
const authenticateFarmerToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if not a farmer
        req.user = user;
        next();
    });
};

module.exports = { generateFarmerToken, authenticateFarmerToken };
