const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { generateToken } = require('./utils/jwtUtils.js');

// Initialize express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory

//MongoDB connection
mongoose.connect('mongodb+srv://farmconnect:farmconnect@cluster0.9nqmz.mongodb.net/farmconnect?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


// Setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');  // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Name the file with a timestamp
  }
});

// Validate file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/; // Allow only image files
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: File type not supported!', false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },  // Limit files to 5MB
  fileFilter: fileFilter
});

// Buyer Schema
const buyerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSubscription', default: null },
});

const Buyer = mongoose.model('Buyer', buyerSchema);
// Farmer Schema
const farmerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerSubscription', default: null },

});

const Farmer = mongoose.model('Farmer', farmerSchema);

// Product Schema (includes image path and farmer details)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  farmerDetails: {
    farmerName: { type: String, required: true },
    location: { type: String, required: true },
    totalArea: { type: String, required: true },
    areaUnderCultivation: { type: String, required: true },
    cropCycle: { type: String, required: true },
    agricultureMethod: { type: String, required: true },
  },
});


const Product = mongoose.model('Product', productSchema);

const userSubscriptionSchema = new mongoose.Schema({
  subscriptionType: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
});

const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);

const farmerSubscriptionSchema = new mongoose.Schema({
  subscriptionType: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
});

const FarmerSubscription = mongoose.model('FarmerSubscription', farmerSubscriptionSchema);

// Password Validation
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};



// Buyer Registration Route
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, address, phoneNumber, email, password } = req.body;

  try {
    // Validate phone number
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits!' });
    }

    // Check if the buyer already exists by email
    const existingBuyer = await Buyer.findOne({ email });
    if (existingBuyer) {
      return res.status(400).json({ success: false, message: 'Buyer already exists with this email.' });
    }

    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long and contain at least one letter and one number.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new buyer
    const newBuyer = new Buyer({ firstName, lastName, address, phoneNumber, email, password: hashedPassword });

    // Save the buyer to the database
    await newBuyer.save();
    
    // Generate JWT token
    const token = generateToken(newBuyer._id);

    res.status(201).json({ success: true, message: 'Buyer registered successfully!', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Error registering buyer' });
  }
});
// Get buyer details by ID
app.get('/api/buyer/:id', async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer not found' });
    }
    res.json({ success: true, buyer });
  } catch (error) {
    console.error('Error fetching buyer details:', error);
    res.status(500).json({ success: false, message: 'Error fetching buyer details' });
  }
});


app.get('/admin-page', async (req, res) => {
  try {
      const userSubscriptions = await UserSubscription.find().populate({
          path: 'buyer',
          select: 'firstName lastName email' // Select specific fields to show
      });

      const farmerSubscriptions = await FarmerSubscription.find().populate({
          path: 'farmer',
          select: 'firstName lastName email' // Select specific fields to show
      });

      res.status(200).json({ userSubscriptions, farmerSubscriptions });
  } catch (error) {
      console.error('Error fetching subscriptions:', error);
      res.status(500).json({ message: 'Error fetching subscriptions' });
  }
});



app.post('/api/subscribe', async (req, res) => {
  const { email, subscriptionType, cardNumber, expiryDate, cvv } = req.body;

  // Validate required fields
  if (!email || !subscriptionType || !cardNumber || !expiryDate || !cvv) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  try {
      // Find the buyer by email
      const buyer = await Buyer.findOne({ email });
      if (!buyer) {
          return res.status(404).json({ message: 'Buyer not found' });
      }

      // Check if the buyer already has an active subscription
      

      // Create a new subscription document
      const newSubscription = new UserSubscription({
          subscriptionType,
          cardNumber,
          expiryDate,
          cvv,
          buyer: buyer._id,
      });

      // Save the subscription to the database
      const savedSubscription = await newSubscription.save();

      // Update the buyer's subscription field
      buyer.subscription = savedSubscription._id;
      await buyer.save();

      res.status(201).json({ message: 'Subscription successful!', buyer });
  } catch (error) {
      console.error('Error saving subscription:', error);
      res.status(500).json({ message: 'Failed to save subscription' });
  }
});


app.post('/api/subscribe-farmer', async (req, res) => {
  const { email, subscriptionType, cardNumber, expiryDate, cvv } = req.body;

  // Validate required fields
  if (!email || !subscriptionType || !cardNumber || !expiryDate || !cvv) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  try {
      // Find the farmer by email
      const farmer = await Farmer.findOne({ email });
      if (!farmer) {
          return res.status(404).json({ message: 'Farmer not found' });
      }

      // Check if the farmer already has an active subscription
      if (farmer.subscription!=null) {
          return res.status(400).json({ message: 'Farmer already has an active subscription' });
      }

      // Create a new subscription document
      const newSubscription = new FarmerSubscription({
          subscriptionType,
          cardNumber,
          expiryDate,
          cvv,
          farmer: farmer._id,
      });

      // Save the subscription to the database
      const savedSubscription = await newSubscription.save();

      // Update the farmer's subscription field
      farmer.subscription = savedSubscription._id;
      await farmer.save();

      res.status(201).json({ message: 'Subscription successful!', farmer });
  } catch (error) {
      console.error('Error saving subscription:', error);
      res.status(500).json({ message: 'Failed to save subscription' });
  }
});






// Farmer Registration Route

app.post('/api/farmer-register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body; // Ensure you're expecting the correct fields

  // Check if all fields are provided
  if (!firstName || !lastName || !email || !password ) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if the farmer already exists by email
    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(400).json({ success: false, message: 'Farmer already exists with this email.' });
    }

   // Validate password
   if (!validatePassword(password)) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long and contain at least one letter and one number.' });
  }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new farmer
    const newFarmer = new Farmer({ firstName, lastName, email, password: hashedPassword });

    // Save the farmer to the database
    await newFarmer.save();
    res.status(201).json({ success: true, message: 'Farmer registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Error registering farmer' });
  }
});

// Buyer Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the buyer by email
    const buyer = await Buyer.findOne({ email });
    if (!buyer) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(buyer._id);

    res.json({ success: true, message: 'Login successful!', token, buyer });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});


app.post('/api/admin-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the buyer by email
    const buyer = await Buyer.findOne({ email });
    if (buyer!="abcd@gmail.com") {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    

    res.json({ success: true, message: 'Login successful!' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});


// Farmer Login Route
app.post('/api/farmer-login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const farmer = await Farmer.findOne({ email });
      if (!farmer) {
          return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, farmer.password);
      if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      // Generate a token after successful login
      const token = generateToken(farmer._id);
      res.json({ success: true, message: 'Login successful!', token });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Error logging in' });
  }
});

// POST route for adding a new product (including image upload)
app.post('/api/products', upload.single('productImage'), async (req, res) => {
  const { name, description, price, unit, category, quantity, farmerDetails } = req.body;
  const imageUrl = req.file.path; // Get the image file path from multer

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      unit,
      category,
      quantity,
      imageUrl,
      farmerDetails: JSON.parse(farmerDetails), // Parse farmerDetails from string
    });
    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding product', error });
  }
});

// GET route for retrieving products by category
app.get('/api/products', async (req, res) => {
  const { category } = req.query;

  try {
    const products = await Product.find(category ? { category } : {});
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
});

// GET route for retrieving products by farmer's email
app.get('/api/farmer-products', async (req, res) => {
  const { email } = req.query;

  try {
    const products = await Product.find({ 'farmerDetails.email': email });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
});

// Route to get buyer details using email
app.get('/api/buyer-details', async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  try {
    const buyer = await Buyer.findOne({ email });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer not found' });
    }
    res.json({ success: true, buyer });
  } catch (error) {
    console.error('Error fetching buyer details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// PUT route for updating a product
app.put('/api/products/:id', upload.single('productImage'), async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, unit, category, quantity, farmerDetails } = req.body;

  // If an image is uploaded, use the new image; otherwise, keep the old one
  const imageUrl = req.file ? req.file.path : undefined;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update product fields only if provided in the request body
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.unit = unit || product.unit;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;
    if (imageUrl) product.imageUrl = imageUrl;
    product.farmerDetails = farmerDetails ? JSON.parse(farmerDetails) : product.farmerDetails; // Parse only if provided

    await product.save();
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product', error });
  }
});

// DELETE route for deleting a product
app.delete('/api/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product', error });
  }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: 'Internal Server Error' });
});


app.get('/api/farmer-details', async (req, res) => {
  try {
      const farmerId = req.user.id; // Assuming the farmer's ID is stored in the session or token
      const farmer = await Farmer.findById(farmerId); // Query the database for farmer details

      if (!farmer) {
          return res.status(404).json({ success: false, message: 'Farmer not found' });
      }

      res.json({ success: true, farmer });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

// Add item to cart or update the quantity if it exists
app.post('/api/cart', async (req, res) => {
  const { productId, quantity, buyerId } = req.body;

  try {
    // Check if the product exists in the inventory
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Validate that the requested quantity is positive and doesn't exceed available stock
    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than zero' });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.quantity} units are available for this product` });
    }

    // Check if the cart already has the product
    const existingCartItem = await CartItem.findOne({ productId, buyerId });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;

      // Validate new total quantity
      if (newQuantity > product.quantity) {
        return res.status(400).json({ success: false, message: `Cannot add more than ${product.quantity} units to the cart` });
      }

      existingCartItem.quantity = newQuantity; // Update the cart item with new quantity
      await existingCartItem.save();
      res.json({ success: true, message: 'Cart updated with new quantity' });
    } else {
      // Create a new cart item if it doesn't exist
      const newCartItem = new CartItem({ productId, quantity, buyerId });
      await newCartItem.save();
      res.status(201).json({ success: true, message: 'Product added to cart' });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Error adding item to cart' });
  }
});

// Get cart items for a buyer
app.get('/api/cart/:buyerId', async (req, res) => {
  try {
    const cartItems = await CartItem.find({ buyerId: req.params.buyerId }).populate('productId');
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ success: false, message: 'No items in cart' });
    }

    res.json({ success: true, cartItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart items' });
  }
});

// Remove item from cart
app.delete('/api/cart/:id', async (req, res) => {
  try {
    const deletedCartItem = await CartItem.findByIdAndDelete(req.params.id);

    if (!deletedCartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ success: false, message: 'Error removing item from cart' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

