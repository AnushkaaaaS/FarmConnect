const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { generateToken, authenticateToken } = require('./utils/jwtUtils.js');
const { userOnly, farmerOnly } = require('./utils/roleMiddleware.js');
const { generateFarmerToken } = require('./utils/jwtUtilsFarmer.js');

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
  address: { type: String, default: null },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UserSubscription', 
    default: null
  },
});
const Buyer = mongoose.model('Buyer', buyerSchema);


// The `UserSubscription` model should have a `subscriptionType` or `planType` field



const farmerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FarmerSubscription', 
    default: null
  },
  farmerDetails: {
    location: { type: String, required: true },
    totalArea: { type: Number, required: true },
    areaUnderCultivation: { type: Number, required: true },
    cropCycle: { type: String, required: true },
    agricultureMethod: { type: String, required: true },
  }
});

const Farmer = mongoose.model('Farmer', farmerSchema);



app.get('/api/products/:productId/farmer-details', async (req, res) => {
  const { productId } = req.params;

  try {
      // Find the product by its ID
      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Get the farmerId from the product
      const farmerId = product.farmerId;

      // Fetch the farmer details using the farmerId
      const farmerDetails = await Farmer.findById(farmerId);

      if (!farmerDetails) {
          return res.status(404).json({ success: false, message: 'Farmer details not found' });
      }

      // Send the farmer's name and farmer details as the response
      res.status(200).json({
          success: true,
          farmerDetails: {
              name: `${farmerDetails.firstName} ${farmerDetails.lastName}`,
              location: farmerDetails.farmerDetails.location,
              totalArea: farmerDetails.farmerDetails.totalArea,
              areaUnderCultivation: farmerDetails.farmerDetails.areaUnderCultivation,
              cropCycle: farmerDetails.farmerDetails.cropCycle,
              agricultureMethod: farmerDetails.farmerDetails.agricultureMethod,
          }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred' });
  }
});



// Product Schema (includes image path and farmer details)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true }, // New field
})



const Product = mongoose.model('Product', productSchema);

const userSubscriptionSchema = new mongoose.Schema({
  subscriptionType: { type: String, required: true },
  paymentId: { 
    type: String, 
    required: true 
},
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
});

const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);

const farmerSubscriptionSchema = new mongoose.Schema({
  subscriptionType: { type: String, required: true },
  paymentId: { 
    type: String, 
    required: true 
},
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
      // Fetch all buyers with populated subscription data
      const buyers = await Buyer.find().populate('subscription');

      // Fetch all farmers with populated subscription data
      const farmers = await Farmer.find().populate('subscription');

      // Return buyers and farmers data separately
      res.json({
          buyers: buyers.map(buyer => ({
              ...buyer.toObject(),
              type: 'Buyer' // Mark as Buyer
          })),
          farmers: farmers.map(farmer => ({
              ...farmer.toObject(),
              type: 'Farmer' // Mark as Farmer
          }))
      });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/user/status', userOnly, async (req, res) => {
  try {
      const buyerId = req.user.buyerId; // Ensure you're getting the ID from the token
      console.log('Fetching subscription status for buyer ID:', buyerId); // Debug log

      const buyer = await Buyer.findById(buyerId).populate('subscription');

      if (!buyer) {
          return res.status(404).json({ message: 'User not found.' });
      }

      console.log('Buyer found:', buyer); // Log the found buyer

      const isSubscribed = buyer.subscription !== null; // Assuming null means no subscription

      res.status(200).json({ is_subscribed: isSubscribed });
  } catch (error) {
      console.error('Error fetching subscription status:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/api/farmer/status', farmerOnly, async (req, res) => {
  try {
      const farmerId = req.user.farmerId; // Ensure you're getting the ID from the token
      console.log('Fetching subscription status for farmer ID:', farmerId); // Debug log

      const farmer = await Farmer.findById(farmerId).populate('subscription');

      if (!farmer) {
          return res.status(404).json({ message: 'Farmer not found.' });
      }

      console.log('Farmer found:', farmer); // Log the found farmer

      const isSubscribed = farmer.subscription !== null; // Assuming null means no subscription

      res.status(200).json({ is_subscribed: isSubscribed });
  } catch (error) {
      console.error('Error fetching subscription status:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});



app.post('/api/subscribe', userOnly, async (req, res) => {
  const { subscriptionType, paymentId } = req.body;

  // Validate required fields
  if (!subscriptionType || !paymentId) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  const buyerId = req.user.buyerId; // Extract buyer ID from the token

  try {
      // Find the buyer by ID
      const buyer = await Buyer.findById(buyerId).populate('subscription');
      if (!buyer) {
          return res.status(404).json({ message: 'Buyer not found' });
      }

      // Check if the buyer already has a subscription
      if (buyer.subscription) {
          return res.status(400).json({ message: 'You can only subscribe once.' });
      }

      // Create a new subscription document with the buyer ID
      const newSubscription = new UserSubscription({
          subscriptionType,
          paymentId,
          buyer: buyerId, // Include the buyer ID here
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






app.post('/api/subscribe-farmer', farmerOnly, async (req, res) => {
  const { subscriptionType, paymentId } = req.body;

  // Validate required fields
  if (!subscriptionType || !paymentId) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  const farmerId = req.user.farmerId; // Extract farmer ID from the token

  try {
      const farmer = await Farmer.findById(farmerId).populate('subscription');
      if (!farmer) {
          return res.status(404).json({ message: 'Farmer not found' });
      }

      // Check if the farmer already has an active subscription
      if (farmer.subscription) {
          return res.status(400).json({ message: 'You can only subscribe once.' });
      }

      // Create a new subscription document
      const newSubscription = new FarmerSubscription({
          subscriptionType,
          paymentId,
          farmer: farmer._id,
      });

      // Save the subscription and update the farmer
      const savedSubscription = await newSubscription.save();
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
  const { firstName, lastName, email, password, farmerDetails } = req.body;

  if (!firstName || !lastName || !email || !password || !farmerDetails) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(400).json({ success: false, message: 'Farmer already exists with this email.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long and contain at least one letter and one number.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFarmer = new Farmer({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      farmerDetails
    });

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

    // Generate JWT token with role
    const token = generateToken(buyer._id, 'buyer'); // Include the role 'buyer'

    res.json({ success: true, message: 'Login successful!', token, buyer });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});


const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password

// Admin login route
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;

    // Check if the provided username and password match the fixed credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return res.status(200).json({ message: 'Login successful' });
    }

    // If credentials don't match, return an error
    return res.status(401).json({ error: 'Invalid credentials' });
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
      const token = generateFarmerToken(farmer._id,'farmer');
      res.json({ success: true, message: 'Login successful!', token
       });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Error logging in' });
  }
});


app.post('/api/products', farmerOnly, upload.single('productImage'), async (req, res) => {
  const { id, name, description, price, unit, category, quantity } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  if (!name || !description || !price || !unit || !category || !quantity) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
      const farmer = await Farmer.findById(req.user.farmerId);
      if (!farmer) return res.status(403).json({ success: false, message: 'Unauthorized access.' });

      let product;
      if (id) {
          // Update existing product
          product = await Product.findByIdAndUpdate(
              id,
              {
                  name,
                  description,
                  price,
                  unit,
                  category,
                  quantity,
                  imageUrl: imageUrl || product.imageUrl,
                  farmerId: farmer._id,
              },
              { new: true }
          );
          res.status(200).json({ success: true, message: 'Product updated successfully', product });
      } else {
          // Create new product
          product = new Product({
              name,
              description,
              price,
              unit,
              category,
              quantity,
              imageUrl,
              farmerId: farmer._id,
          });
          await product.save();
          res.status(201).json({ success: true, message: 'Product added successfully', product });
      }
  } catch (error) {
      console.error('Error processing product:', error);
      res.status(500).json({ success: false, message: 'Error processing product', error: error.message || 'Internal Server Error' });
  }
});



app.get('/api/your-products', farmerOnly, async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user.farmerId }); // Fetch products by farmer ID
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});


app.delete('/api/products/:id', farmerOnly, async (req, res) => {
  const { id } = req.params; // Get the product ID from the request parameters

  try {
    // Find the product by ID and ensure it belongs to the authenticated farmer
    const product = await Product.findOne({ _id: id, farmerId: req.user.farmerId });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or you are not authorized to delete this product' });
    }

    await product.deleteOne(); // Delete the product
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
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
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'], // Ensure quantity is at least 1
    default: 1, // Default quantity is 1
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true,
  },
}, { timestamps: true }); // Enable timestamps for createdAt and updatedAt

const CartItem = mongoose.model('CartItem', cartItemSchema);


// Add item to cart or update the quantity if it exists
// Add item to cart
app.post('/api/cart', userOnly, async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate input
  if (!productId || quantity === undefined) {
    return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
  }

  const buyerId = req.user.buyerId; // Extract buyerId from the token

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than zero' });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.quantity} units are available for this product` });
    }

    const existingCartItem = await CartItem.findOne({ productId, buyerId });

    if (existingCartItem) {
      // Update the quantity of the existing cart item
      existingCartItem.quantity = quantity;

      // Check if the updated quantity exceeds available stock
      if (existingCartItem.quantity > product.quantity) {
        return res.status(400).json({ success: false, message: `Cannot add more than ${product.quantity} units to the cart` });
      }

      await existingCartItem.save();
      return res.json({ success: true, message: 'Cart updated with new quantity', cartItem: existingCartItem });
    } else {
      // If the item doesn't exist in the cart, create a new cart item
      const newCartItem = new CartItem({ productId, quantity, buyerId });
      await newCartItem.save();
      return res.status(201).json({ success: true, message: 'Product added to cart', cartItem: newCartItem });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ success: false, message: 'Error adding item to cart' });
  }
});

// Get cart items for a buyer
app.get('/api/cart', userOnly, async (req, res) => {
  const buyerId = req.user.buyerId; // Extract buyerId from the token

  try {
    // Fetch cart items for the authenticated buyer and populate the product details
    const cartItems = await CartItem.find({ buyerId }).populate({
      path: 'productId', // Populate the product details
      select: 'name price imageUrl unit quantity', // Select only the fields you need
    });

    // Check if cartItems is an array and not empty
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(404).json({ success: false, message: 'No items in cart' });
    }

    // Return the cart items
    res.json({ success: true, cartItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart items' });
  }
});











// Remove item from cart
app.delete('/api/cart/:id', userOnly, async (req, res) => {
  const buyerId = req.user.buyerId; // Extract buyerId from the token
  const itemId = req.params.id;

  try {
    const cartItem = await CartItem.findOne({ _id: itemId, buyerId }); // Correctly checks for the cart item ID
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found or unauthorized' });
    }

    await cartItem.deleteOne(); // Use deleteOne() instead of remove()
    res.json({ success: true, message: 'Item removed from cart', item: cartItem });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ success: false, message: 'Error removing item from cart' });
  }
});

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
  cartItems: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
  }],
  totalPrice: { type: Number, required: true },
  address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
  },
 
  status: { type: String, enum: ['Pending', 'Processing', 'Completed'], default: 'Pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

const OrderStatusSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
  },
});

const OrderStatus = mongoose.model('OrderStatus', OrderStatusSchema);

app.get('/api/orders', userOnly, async (req, res) => {
  const buyerId = req.user.buyerId;

  try {
      const orders = await Order.find({ buyerId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, orders });
  } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch orders. Please try again.' });
  }
});

app.post('/api/checkout', userOnly, async (req, res) => {
  const buyerId = req.user.buyerId;
  const { cartItems, totalPrice, address } = req.body;

  try {
      // Create a new order
      const newOrder = new Order({
          buyerId,
          cartItems,
          totalPrice,
          address,
      });

      // Save the new order to the database
      await newOrder.save();

      // Delete the cart items associated with the buyer
      await CartItem.deleteMany({ buyerId });

      return res.status(201).json({ success: true, message: 'Order placed successfully!', order: newOrder });
  } catch (error) {
      console.error('Error placing order:', error);
      return res.status(500).json({ success: false, message: 'Failed to place order. Please try again.' });
  }
});


// Fetch farmer orders
app.get('/api/farmer-orders', farmerOnly, async (req, res) => {
  const farmerId = req.user.farmerId;

  try {
      // Find all products of the farmer
      const products = await Product.find({ farmerId });

      if (products.length === 0) {
          return res.status(200).json({ success: true, orders: [] });
      }

      // Find orders that contain those products and populate details
      const orders = await Order.find({
          'cartItems.productId': { $in: products.map(product => product._id) }
      })
      .populate('cartItems.productId') // Populate product details
      .populate('buyerId'); // Populate buyer details

      res.status(200).json({ success: true, orders });
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Update order status
app.put('/api/update-order-status/:orderId', farmerOnly, async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;

  try {
      const order = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });
      if (!order) {
          return res.status(404).json({ success: false, message: 'Order not found' });
      }
      res.status(200).json({ success: true, order });
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

