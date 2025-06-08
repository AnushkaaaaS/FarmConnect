const express = require('express');
const router = express.Router();
const Buyer = require('../models/Buyer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Buyer Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const buyer = new Buyer({ name, email, password });
    await buyer.save();
    res.status(201).json({ success: true, message: 'Buyer registered successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering buyer', error });
  }
});

// Buyer Login Route with JWT token generation
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const buyer = await Buyer.findOne({ email });
    if (!buyer) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: buyer._id, email: buyer.email }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ success: true, message: 'Login successful!', token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging in', error });
  }
});

module.exports = router;
