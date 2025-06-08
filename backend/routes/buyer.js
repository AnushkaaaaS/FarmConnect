const express = require('express');
const bcrypt = require('bcrypt');
const Buyer = require('../models/Buyer'); // Ensure the path is correct
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
    const { firstName, lastName, address, phoneNumber, email, password } = req.body;

    try {
        // Check if buyer already exists
        const existingBuyer = await Buyer.findOne({ email });
        if (existingBuyer) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newBuyer = new Buyer({
            firstName,
            lastName,
            address,
            phoneNumber,
            email,
            password: hashedPassword,
        });

        await newBuyer.save();
        res.status(201).json({ message: 'Buyer registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
