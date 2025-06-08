const { authenticateToken } = require('./jwtUtils');
const { authenticateFarmerToken } = require('./jwtUtilsFarmer'); // Adjust this import based on your structure

// Middleware for routes accessible only by users (buyers)
const userOnly = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.role !== 'buyer') return res.sendStatus(403); // Forbidden if not a buyer
        next();
    });
};

// Middleware for routes accessible only by farmers
const farmerOnly = (req, res, next) => {
    authenticateFarmerToken(req, res, () => {
        if (req.user.role !== 'farmer') return res.sendStatus(403); // Forbidden if not a farmer
        next();
    });
};

module.exports = { userOnly, farmerOnly };
