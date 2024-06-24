const Product = require('../models/productmodel');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('products', { products });
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
};

exports.showProduct = async (req, res) => {
  let productId = req.params.id;
  try {
    let product = await Product.findById(productId);
    if (product) {
      res.render('showProduct', { item: product });
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { size, type } = req.body;
    let query = {};
    if (size) {
      query['sizes.size'] = size;
    }
    if (type) {
      query.type = type;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
