const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const Product = require('./models/productmodel');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'some secret',
  resave: false,
/*  saveUninitialized: false,//3shan my3melsh session gdeeda m3 kol req
  cookie: { maxAge: 1800000  //30 mins
}*/

  saveUninitialized: true,
  cookie: { secure: false}}
));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

const port = 3000;

//connect db
const dbURl = 'mongodb+srv://hagar2204577:R7nULH9qSYkl5otw@hagar.shuywlc.mongodb.net/alldata?retryWrites=true&w=majority';
mongoose.connect(dbURl, {})
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });



  /////////// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }
  res.redirect('/'); 
}


// Routes
app.get('/dashboard', (req, res) => {
  res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

//product
//images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/db');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = function (req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Error: Images only!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});
app.get('/adminchange', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('adminchange', { products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error fetching products: ' + err.message);
  }
});

app.post('/adminchange', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), [
  body('name').notEmpty().withMessage('Product Name is required'),
  body('type').isAlpha().withMessage('Product Type must contain letters only').notEmpty().withMessage('Product Type is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Product Price must be a positive number').notEmpty().withMessage('Product Price is required'),
  body('description').notEmpty().withMessage('Product Description is required'),
  body('sizes').isArray({ min: 1 }).withMessage('At least one size must be selected'),
  body('quantities').custom((value, { req }) => {
   
    const selectedSizes = req.body.sizes || [];
    const quantities = value.split(',').map(qty => {
      const parsedQty = parseInt(qty.trim(), 10);
      if (isNaN(parsedQty)) {
        throw new Error('Invalid quantity format');
      }
      return parsedQty;
    });    if (selectedSizes.length !== quantities.length) {
      throw new Error('Sizes and quantities arrays must be of the same length');
    }
    if (quantities.some(qty => !Number.isInteger(parseInt(qty, 10)) || parseInt(qty, 10) <= 0)) {
      throw new Error('Quantities must be positive integers');
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, type, price, description } = req.body;
  const sizes = req.body.sizes || [];
  const quantities = req.body.quantities.split(',').map(qty => parseInt(qty.trim(), 10));

  try {
    const imagePaths = {
      image1: req.files['image1'] ? req.files['image1'][0].filename : null,
      image2: req.files['image2'] ? req.files['image2'][0].filename : null,
      image3: req.files['image3'] ? req.files['image3'][0].filename : null
    };
    const sizesArray = sizes.map((size, index) => ({
      size,
      quantity: parseInt(quantities[index], 10)
    }));


    const newProduct = new Product({
      image1: imagePaths.image1,
      image2: imagePaths.image2,
      image3: imagePaths.image3,
      name,
      type,
      price: parseFloat(price),
      description,
      sizes: sizesArray
    });

    await newProduct.save();
    res.redirect('/adminchange');
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).send('Error saving product: ' + err.message);
  }
});
const sizes = ['xs','s', 'm', 'l','xl','2xl'];
app.get('/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('editproduct', { product ,sizes});
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Error fetching product: ' + err.message);
  }
});


//edit product
app.post('/edit/:id', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), [
  body('name').notEmpty().withMessage('Product Name is required'),
  body('type').isAlpha().withMessage('Product Type must contain letters only').notEmpty().withMessage('Product Type is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Product Price must be a positive number').notEmpty().withMessage('Product Price is required'),
  body('description').notEmpty().withMessage('Product Description is required'),
  body('sizes').isArray({ min: 1 }).withMessage('At least one size must be selected'),
  body('quantities').optional().custom((value, { req }) => {
    if (!value) {
      // Handle case where quantities is not provided
      throw new Error('Quantities must be provided');
  }
    // Validate quantities based on selected sizes
    const selectedSizes = req.body.sizes || [];
    const quantities = value.split(',').map(qty => {
      const parsedQty = parseInt(qty.trim(), 10);
      if (isNaN(parsedQty)) {
        throw new Error('Invalid quantity format');
      }
      return parsedQty;
    });    if (selectedSizes.length !== quantities.length) {
      throw new Error('Sizes and quantities arrays must be of the same length');
    }
    if (quantities.some(qty => !Number.isInteger(parseInt(qty, 10)) || parseInt(qty, 10) <= 0)) {
      throw new Error('Quantities must be positive integers');
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, type, price, description } = req.body;
  const sizes = req.body.sizes || [];
  const quantities = req.body.quantities.split(',').map(qty => parseInt(qty.trim(), 10));

  try {
    const imagePaths = {
      image1: req.files['image1'] ? req.files['image1'][0].filename : null,
      image2: req.files['image2'] ? req.files['image2'][0].filename : null,
      image3: req.files['image3'] ? req.files['image3'][0].filename : null
    };
    const sizesArray = sizes.map((size, index) => ({
      size,
      quantity: parseInt(quantities[index], 10)
    }));


    const updatingproduct = new Product({
      image1: imagePaths.image1,
      image2: imagePaths.image2,
      image3: imagePaths.image3,
      name,
      type,
      price: parseFloat(price),
      description,
      sizes: sizesArray
    });

    await updatingproduct .save();
    res.redirect('/adminchange');
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).send('Error saving product: ' + err.message);
  }
});



app.get('/delete/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.findByIdAndDelete(productId);
    res.redirect('/adminchange');
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send('Error deleting product: ' + err.message);
  }
});

// User 
//get from db 

app.get('/adminuser', async (req, res) => {
  try {
    const users = await User.find();
    res.render('adminuser', { users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users: ' + err.message);
  }
});

// Send to DB
app.post('/adminuser',
  [
    body('fullname').isString().withMessage('Full Name must be a string').isAlpha('en-US', { ignore: ' ' }).withMessage('Full Name must contain only letters and spaces'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('phoneNumber').isNumeric().isLength({ min: 10, max: 10 }).withMessage('Please enter a valid 10-digit phone number'),
    body('city').isString().withMessage('City must be a string').isAlpha('en-US', { ignore: ' ' }).withMessage('City must contain only letters and spaces'),
    body('address').isString().withMessage('Address must be a string'),
    body('locationDetails').isString().withMessage('Location Details must be a string'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, phoneNumber, city, address, locationDetails, password } = req.body;

    try {
      const newUser = new User({
        fullname,
        email,
        phoneNumber,
        city,
        address,
        locationDetails,
        password:hashedPassword,
      });

      await newUser.save();

      res.redirect('/adminuser');
    } catch (err) {
      console.error('Error adding user:', err);
      res.status(500).send('Error adding user: ' + err.message);
    }
  }
);

// Edit user form
app.get('/edituser/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    res.render('edituser', { user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).send('Error fetching user: ' + err.message);
  }
});

// Update user
app.post('/edituser/:id', [
  body('fullname').isString().withMessage('Full Name must be a string').isAlpha('en-US', { ignore: ' ' }).withMessage('Full Name must contain only letters and spaces'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('phoneNumber').isNumeric().isLength({ min: 10, max: 10 }).withMessage('Please enter a valid 10-digit phone number'),
  body('city').isString().withMessage('City must be a string').isAlpha('en-US', { ignore: ' ' }).withMessage('City must contain only letters and spaces'),
  body('address').isString().withMessage('Address must be a string'),
  body('locationDetails').isString().withMessage('Location Details must be a string'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.params.id;
  const { fullname, email, phoneNumber, city, address, locationDetails } = req.body; // Corrected 'phone' to 'phoneNumber'

  console.log('Updating user with ID:', userId);
  console.log('Received data:', req.body);

  try {
      await User.findByIdAndUpdate(userId, {
          fullname,
          email,
          phoneNumber,
          city,
          address,
          locationDetails,
      });

      res.redirect('/adminuser');
  } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).send('Error updating user: ' + err.message);
  }
});

// Delete user
app.get('/deleteuser/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.redirect('/adminuser');
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Error deleting user: ' + err.message);
  }
});

///////////////////// zahaa //////////////////////////

app.get('/', (req, res) => {
  res.render('accountForm');
});

app.get('/insidewishlist',isAuthenticated, (req, res) => {
  res.render('insidewishlist');
});

app.get('/myprofile',isAuthenticated,(req, res) => {
  res.render('myprofile');
});


 
// Sign up 
app.post('/signup', async (req, res) => {
  try {
    const { fullname, phoneNumber, city, address, locationDetails, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('user exists');
      return res.status(400).json({ message: 'User already exists' });
    }
    console.log('user doesnot exist');

    const hashedPassword = await bcrypt.hash(password, 10);


    const newuser = new User({
      fullname,
      email,
      phoneNumber,
      city,
      address,
      locationDetails,
      password: hashedPassword, 
    });

    await newuser.save();
    console.log('new user created ');
   
    ///////Initialize session
    req.session.userId = newuser._id;
    req.session.authenticated = true;
console.log('session intialized');
    
    res.redirect('/myprofile');


  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
  



// Sign in 
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email: ${email} and pass: ${password}");

   const user = await User.findOne({ email });

    if (!user) {
      console.log('no user found');
  return res.status(400).json({ message: 'invalid Email or password ' });
    }
    console.log('user found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('passw wrong');

      return res.status(400).json({ message: 'invalid email or Password' });
    }

   ///// Initialize session
   req.session.userId = user._id;
   req.session.authenticated = true;
   console.log('session intialized');

   res.redirect('/myprofile');



  }catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get user details based on current session
app.get('/user', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      city: user.city,
      address: user.address,
      locationDetails: user.locationDetails
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


///// i donot  need this bec we are already in a session
/*
//to get user data from the db first 
app.get('/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});*/

app.put('/update', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;

    const { newemail, newFullname, newPhoneNumber, newCity, newAddress, newLocationDetails, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (newemail) user.email = email;
    if (newFullname) user.fullname = newFullname;
    if (newPassword) user.password = await bcrypt.hash(newPassword, 10); 
    if (newPhoneNumber) user.phoneNumber = newPhoneNumber;
    if (newCity) user.city = newCity;
    if (newAddress) user.address = newAddress;
    if (newLocationDetails) user.locationDetails = newLocationDetails
    await user.save();

console.log('User updated successfully');

  
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



//lw user 3ayz y delete his acc 
app.delete('/delete/:email', isAuthenticated, async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.status(200).json({ message: 'user deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

