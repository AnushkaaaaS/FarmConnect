
// const mongoose = require('mongoose');

// const BuyerSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   address: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const Buyer = mongoose.model('Buyer', BuyerSchema);
// module.exports = Buyer;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

buyerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Buyer', buyerSchema);
