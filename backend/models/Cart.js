// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//   quantity: { type: Number, default: 1 }
// });

// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String,
//   cart: [cartItemSchema]  // Each user has a cart with cart items
// });

// const User = mongoose.model('User', userSchema);

// Cart Schema
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true }, // Link to Buyer
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      imageUrl: { type: String, required: true }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);
