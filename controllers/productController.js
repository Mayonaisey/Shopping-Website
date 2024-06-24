
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Product = require('../models/productmodel')

// Multer configuration
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

exports.getAdminChange = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('adminchange', { products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error fetching products: ' + err.message);
  }
};

exports.postAdminChange = [
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
  ]),
  [
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
      });
      if (selectedSizes.length !== quantities.length) {
        throw new Error('Sizes and quantities arrays must be of the same length');
      }
      if (quantities.some(qty => !Number.isInteger(parseInt(qty, 10)) || parseInt(qty, 10) <= 0)) {
        throw new Error('Quantities must be positive integers');
      }
      return true;
    })
  ],
  async (req, res) => {
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
  }
];

exports.getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('editProduct', { product });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Error fetching product: ' + err.message);
  }
};

exports.postEditProduct = [
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
  ]),
  [
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
      });
      if (selectedSizes.length !== quantities.length) {
        throw new Error('Sizes and quantities arrays must be of the same length');
      }
      if (quantities.some(qty => !Number.isInteger(parseInt(qty, 10)) || parseInt(qty, 10) <= 0)) {
        throw new Error('Quantities must be positive integers');
      }
      return true;
    })
  ],
  async (req, res) => {
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

      const updatedFields = {
        name,
        type,
        price: parseFloat(price),
        description,
        sizes: sizes.map((size, index) => ({
          size,
          quantity: parseInt(quantities[index], 10)
        }))
      };

      // Only update image paths if new images were uploaded
      if (imagePaths.image1) updatedFields.image1 = imagePaths.image1;
      if (imagePaths.image2) updatedFields.image2 = imagePaths.image2;
      if (imagePaths.image3) updatedFields.image3 = imagePaths.image3;

      await Product.findByIdAndUpdate(req.params.id, updatedFields);
      res.redirect('/adminchange');
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).send('Error updating product: ' + err.message);
    }
  }
];

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.findByIdAndDelete(productId);
    res.redirect('/adminchange');
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send('Error deleting product: ' + err.message);
  }
};

