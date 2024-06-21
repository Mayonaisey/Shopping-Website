// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const fileUpload = require('express-fileupload');

// // const userRoutes = require('./routes/user');
// // const adminRoutes = require('./routes/admin');
// const indexRoutes=require('./routes/index');

// const app = express();
// app.use(fileUpload());
// app.use(session({
//    secret: 'hello123', // Replace with your own secret key
//    resave: false,
//    saveUninitialized: true,
//    cookie: { secure: false } // Set secure: true if you are using https
//  }));
// app.use(express.static('public')); //Static means pre-rendered web pages that do not change on time
// app.set('view engine', 'ejs'); //View engines allow us to render web pages using template files

// // app.use(userRoutes);
// // app.use(adminRoutes);
// // app.use(indexRoutes);

// const dbURI='mongodb+srv://hagar2204577:R7nULH9qSYkl5otw@hagar.shuywlc.mongodb.net/?retryWrites=true&w=majority&appName=hagar';

// mongoose.connect(dbURI)
//    .then(result => app.listen(8080))
//    .catch(err => console.log(err));







const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const Product = require('./models/productmodel');

const app = express();
const port = 3000;

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, './public/images/db');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = function (req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images only!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
const dbURI = "mongodb+srv://hagar2204577:R7nULH9qSYkl5otw@hagar.shuywlc.mongodb.net/alldata?retryWrites=true&w=majority&appName=hagar";
mongoose.connect(dbURI)
  .then(() => {
    app.listen(port, () => {
      console.log('Server running at http://localhost:${port}/');
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.redirect('/adminchange');
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
]), async (req, res) => {
  const { name, type, price, description, size, gender, quantity } = req.body;

  if (!name || !type || !price || !description || !size || !gender || !quantity) {
    return res.status(400).send('All fields are required.');
  }

  const productPrice = parseFloat(price);
  const productQuantity = parseInt(quantity, 10);

  if (isNaN(productPrice) || productPrice < 0) {
    return res.status(400).send('Price must be a positive number.');
  }

  if (isNaN(productQuantity) || productQuantity < 0) {
    return res.status(400).send('Quantity must be a positive integer.');
  }

  try {
    console.log('req.files:', req.files); // Debugging statement

    const imagePaths = {
      image1: req.files['image1'] ? req.files['image1'][0].filename : existingImage1,

      image2: req.files['image2'] ? req.files['image2'][0].path.replace('public', '') : null,
      image3: req.files['image3'] ? req.files['image3'][0].path.replace('public', '') : null
    };

    const newProduct = new Product({
      image1: imagePaths.image1,
      image2: imagePaths.image2,
      image3: imagePaths.image3,
      name,
      type,
      price: productPrice,
      description,
      size,
      gender,
      quantity: productQuantity,
    });

    await newProduct.save();
    res.redirect('/adminchange');
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).send('Error saving product: ' + err.message);
  }
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

app.get('/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('editproduct', { product });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Error fetching product: ' + err.message);
  }
});

app.post('/edit/:id', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), async (req, res) => {
  const { name, type, price, description, size, gender, quantity, existingImage1, existingImage2, existingImage3 } = req.body;

  if (!name || !type || !price || !description || !size || !gender || !quantity) {
    return res.status(400).send('All fields are required.');
  }

  const productPrice = parseFloat(price);
  const productQuantity = parseInt(quantity, 10);

  if (isNaN(productPrice) || productPrice < 0) {
    return res.status(400).send('Price must be a positive number.');
  }

  if (isNaN(productQuantity) || productQuantity < 0) {
    return res.status(400).send('Quantity must be a positive integer.');
  }

  try {
    const imagePaths = {
      image1: req.files['image1'] ? req.files['image1'][0].path.replace('public', '') : existingImage1,
      image2: req.files['image2'] ? req.files['image2'][0].path.replace('public', '') : existingImage2,
      image3: req.files['image3'] ? req.files['image3'][0].path.replace('public', '') : existingImage3
    };

    await Product.findByIdAndUpdate(req.params.id, {
      image1: imagePaths.image1,
      image2: imagePaths.image2,
      image3: imagePaths.image3,
      name,
      type,
      price: productPrice,
      description,
      size,
      gender,
      quantity: productQuantity,
    }, { new: true }).exec();

    res.redirect('/adminchange');
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Error updating product: ' + err.message);
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