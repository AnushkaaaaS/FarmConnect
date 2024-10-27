const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const authenticateToken = require('../middlewares/auth');

// Add item to cart for logged-in user
router.post('/', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const newCartItem = new Cart({
      buyerId: req.user.id, // Get buyer ID from the authenticated user
      productId,
      quantity,
    });

    await newCartItem.save();
    res.status(201).json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding item to cart', error });
  }
});

// Get cart items for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cartItems = await Cart.find({ buyerId: req.user.id }).populate('productId');
    res.json({ success: true, cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cart items', error });
  }
});

// Remove item from cart
router.delete('/:id', authenticateToken, async (req, res) => {
  const cartItemId = req.params.id;

  try {
    const cartItem = await Cart.findById(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (cartItem.buyerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access Denied' });
    }

    await cartItem.remove();
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing item from cart', error });
  }
});

module.exports = router;
