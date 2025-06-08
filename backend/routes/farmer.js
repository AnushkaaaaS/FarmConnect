// routes/farmer.js
const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer'); // Assuming you have a Farmer model

// Get farmer's account details by ID (or by email)
router.get('/account/:id', async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({ msg: 'Farmer not found' });
        }
        res.json(farmer);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
