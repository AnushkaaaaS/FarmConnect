require('dotenv').config();
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
const buyerFAQRouter = require('./routes/buyerFAQ');

// Initialize express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Use the buyer FAQ router
app.use(buyerFAQRouter);

//MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
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


const axios = require("axios");
const fs = require("fs");


app.post("/predict", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Send image to Flask API
        const flaskResponse = await axios.post("http://localhost:5000/predict", 
            { file: fs.createReadStream(req.file.path) },
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Remove uploaded file
        fs.unlinkSync(req.file.path);

        // Send the prediction response to frontend
        res.json(flaskResponse.data);
    } catch (error) {
        res.status(500).json({ error: "Error predicting image" });
    }
});





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
      const buyers = await Buyer.find().populate('subscription');

      const farmers = await Farmer.find().populate('subscription');

      
      res.json({
          buyers: buyers.map(buyer => ({
              ...buyer.toObject(),
              type: 'Buyer' 
          })),
          farmers: farmers.map(farmer => ({
              ...farmer.toObject(),
              type: 'Farmer' 
          }))
      });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/user/status', userOnly, async (req, res) => {
  try {
      const buyerId = req.user.buyerId; 
      console.log('Fetching subscription status for buyer ID:', buyerId); 

      const buyer = await Buyer.findById(buyerId).populate('subscription');

      if (!buyer) {
          return res.status(404).json({ message: 'User not found.' });
      }

      console.log('Buyer found:', buyer); 

      const isSubscribed = buyer.subscription !== null; 

      res.status(200).json({ is_subscribed: isSubscribed });
  } catch (error) {
      console.error('Error fetching subscription status:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/api/farmer/status', farmerOnly, async (req, res) => {
  try {
      const farmerId = req.user.farmerId; 
      console.log('Fetching subscription status for farmer ID:', farmerId);

      const farmer = await Farmer.findById(farmerId).populate('subscription');

      if (!farmer) {
          return res.status(404).json({ message: 'farmer not found.' });
      }

      console.log('farmer found:', farmer); 
      const isSubscribed = farmer.subscription !== null; 

      res.status(200).json({ is_subscribed: isSubscribed });
  } catch (error) {
      console.error('Error fetching subscription status:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/api/farmer/status', farmerOnly, async (req, res) => {
  try {
      const farmerId = req.user.farmerId; 
      console.log('Fetching subscription status for farmer ID:', farmerId); 
      const farmer = await Farmer.findById(farmerId).populate('subscription');

      if (!farmer) {
          return res.status(404).json({ message: 'Farmer not found.' });
      }

      console.log('Farmer found:', farmer); 

      const isSubscribed = farmer.subscription !== null; 

      res.status(200).json({ is_subscribed: isSubscribed });
  } catch (error) {
      console.error('Error fetching subscription status:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});



app.post('/api/subscribe', userOnly, async (req, res) => {
  const { subscriptionType, paymentId } = req.body;

  if (!subscriptionType || !paymentId) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  const buyerId = req.user.buyerId; 

  try {
      const buyer = await Buyer.findById(buyerId).populate('subscription');
      if (!buyer) {
          return res.status(404).json({ message: 'Buyer not found' });
      }

      if (buyer.subscription) {
          return res.status(400).json({ message: 'You can only subscribe once.' });
      }

      const newSubscription = new UserSubscription({
          subscriptionType,
          paymentId,
          buyer: buyerId,
      });

      const savedSubscription = await newSubscription.save();

      buyer.subscription = savedSubscription._id;
      await buyer.save();

      res.status(201).json({ message: 'Subscription successful!', buyer });
  } catch (error) {
      console.error('Error saving subscription:', error);
      res.status(500).json({ message: 'Failed to save subscription' });
  }
});







const featuredFarmerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  farmerDetails: {
    location: { type: String, required: true },
    totalArea: { type: Number, required: true },
    areaUnderCultivation: { type: Number, required: true },
    cropCycle: { type: String, required: true },
    agricultureMethod: { type: String, required: true },
  },
  subscriptionType: { type: String, required: true },
  subscriptionDate: { type: Date, default: Date.now }
});

const FeaturedFarmer = mongoose.model('FeaturedFarmer', featuredFarmerSchema);

app.post('/api/subscribe-farmer', farmerOnly, async (req, res) => {
  const { subscriptionType, paymentId } = req.body;

  if (!subscriptionType || !paymentId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const farmerId = req.user.farmerId; 

  try {
    const farmer = await Farmer.findById(farmerId).populate('subscription');
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    if (farmer.subscription) {
      return res.status(400).json({ message: 'You can only subscribe once.' });
    }

    const newSubscription = new FarmerSubscription({
      subscriptionType,
      paymentId,
      farmer: farmer._id,
    });

    const savedSubscription = await newSubscription.save();
    farmer.subscription = savedSubscription._id;
    await farmer.save();

    const populatedFarmer = await Farmer.findById(farmerId).populate('subscription');

    const newFeaturedFarmer = new FeaturedFarmer({
      firstName: farmer.firstName,
      lastName: farmer.lastName,
      farmerDetails: farmer.farmerDetails,
      subscriptionType: subscriptionType,
    });

    await newFeaturedFarmer.save();

    res.status(201).json({ message: 'Subscription successful!', farmer: populatedFarmer });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ message: 'Failed to save subscription', error: error.message });
  }
});

app.get('/api/featured-farmers', async (req, res) => {
  try {
    const featuredFarmers = await FeaturedFarmer.find();  
    res.json(featuredFarmers);
  } catch (error) {
    console.error('Error fetching featured farmers:', error);
    res.status(500).json({ message: 'Failed to fetch featured farmers' });
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
    const buyer = await Buyer.findOne({ email });
    if (!buyer) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(buyer._id, 'buyer'); // Include the role 'buyer'

    res.json({ success: true, message: 'Login successful!', token, buyer });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});





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

      const token = generateFarmerToken(farmer._id,'farmer');
      res.json({ success: true, message: 'Login successful!', token
       });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Error logging in' });
  }
});

app.post('/generate-content', async (req, res) => {
  try {
    const { model, contents } = req.body;
    
    // Validate input
    if (!contents || typeof contents !== 'string') {
      return res.status(400).json({ error: 'Invalid content format' });
    }

    // Determine the appropriate Gemini model
    const geminiModel = model === 'gemini-2.0-flash' ? 
      'gemini-1.5-flash' : // Update to current model name
      'gemini-pro';

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: contents
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      }
    );

    // Handle Gemini response safely
    const geminiResponse = response.data;
    if (!geminiResponse.candidates || !geminiResponse.candidates[0].content.parts[0].text) {
      throw new Error('Invalid response structure from Gemini API');
    }
    
    res.json({ 
      text: geminiResponse.candidates[0].content.parts[0].text,
      modelUsed: geminiModel // Optional: send back which model was used
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message // Send error details to frontend
    });
  }
});

app.post('/api/products', farmerOnly, upload.single('productImage'), async (req, res) => {
  const { id, name, description, price, unit, category, quantity } = req.body;
  
  // Full image URL accessible from frontend
  const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

  if (!name || !description || !price || !unit || !category || !quantity) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
      const farmer = await Farmer.findById(req.user.farmerId);
      if (!farmer) return res.status(403).json({ success: false, message: 'Unauthorized access.' });

      let product;
      if (id) {
          product = await Product.findById(id);
          const updatedImageUrl = imageUrl || product.imageUrl;

          product = await Product.findByIdAndUpdate(
              id,
              {
                  name,
                  description,
                  price,
                  unit,
                  category,
                  quantity,
                  imageUrl: updatedImageUrl,
                  farmerId: farmer._id,
              },
              { new: true }
          );
          res.status(200).json({ success: true, message: 'Product updated successfully', product });
      } else {
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
  const { id } = req.params; 

  try {
    const product = await Product.findOne({ _id: id, farmerId: req.user.farmerId });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or you are not authorized to delete this product' });
    }

    await product.deleteOne(); 
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
  const { email } = req.query; 

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
      const farmerId = req.user.id; 
      const farmer = await Farmer.findById(farmerId); 

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
    min: [1, 'Quantity must be at least 1'], 
    default: 1, 
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true,
  },
}, { timestamps: true }); 
const CartItem = mongoose.model('CartItem', cartItemSchema);


// Add item to cart
app.post('/api/cart', userOnly, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
  }

  const buyerId = req.user.buyerId; 

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
      existingCartItem.quantity = quantity;

      if (existingCartItem.quantity > product.quantity) {
        return res.status(400).json({ success: false, message: `Cannot add more than ${product.quantity} units to the cart` });
      }

      await existingCartItem.save();
      return res.json({ success: true, message: 'Cart updated with new quantity', cartItem: existingCartItem });
    } else {
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
    const cartItems = await CartItem.find({ buyerId }).populate({
      path: 'productId', 
      select: 'name price imageUrl unit quantity', 
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
    // Find orders placed by the current buyer
    const orders = await Order.find({ buyerId })
      .populate('cartItems.productId') // Populate product details for each item in the cart
      .populate('buyerId') // Populate buyer details
      .sort({ createdAt: -1 }); // Sort orders by most recent

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders. Please try again.' });
  }
});


app.post('/api/checkout', userOnly, async (req, res) => {
  const buyerId = req.user.buyerId;
  const { cartItems, totalPrice, address } = req.body;

  try {
      for (let item of cartItems) {
          const { productId, quantity } = item;

          // Find the product
          const product = await Product.findById(productId);
          if (product) {
              // Check if enough stock is available
              if (product.quantity >= quantity) {
                  // Create a new order
                  const newOrder = new Order({
                      buyerId,
                      cartItems: [{ productId, quantity }],
                      totalPrice: product.price * quantity,
                      address,
                  });

                  // Save the order
                  await newOrder.save();

                  // Reduce the stock quantity
                  product.quantity -= quantity;
                  const updatedProduct = await product.save();  // Ensure the updated product is saved

                  console.log(`Product updated: ${updatedProduct.name} | New Quantity: ${updatedProduct.quantity}`);

              } else {
                  return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}` });
              }
          } else {
              return res.status(404).json({ success: false, message: 'Product not found' });
          }
      }

      // Clear cart items
      await CartItem.deleteMany({ buyerId });

      return res.status(201).json({ success: true, message: 'Order(s) placed successfully!' });
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

      const orders = await Order.find({
          'cartItems.productId': { $in: products.map(product => product._id) },
      })
      .populate('cartItems.productId') 
      .populate('buyerId'); 

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

