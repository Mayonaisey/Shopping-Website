// const User = require('../models/User');
// const Product = require('../models/Product');

// // Add a product to the cart
// exports.addToCart = async (req, res) => {
//   const { productId, quantity } = req.body;
//   const userId = req.params.userId; // Assuming userId is passed in the route params

//   try {
//     let user = await User.findById(userId);

//     // Check if the product is already in the cart
//     const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);

//     if (productIndex !== -1) {
//       // If product exists, update quantity
//       user.cart[productIndex].quantity += parseInt(quantity);
//     } else {
//       // If product does not exist, add new item to cart
//       user.cart.push({ productId, quantity: parseInt(quantity) });
//     }

//     await user.save();

//     res.status(200).json({ message: 'Product added to cart successfully', user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Get user's cart
// exports.getCart = async (req, res) => {
//   const userId = req.params.userId; // Assuming userId is passed in the route params

//   try {
//     const user = await User.findById(userId).populate('cart.productId');

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json({ cart: user.cart });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

const User = require('../models/userModel');
const Product = require('../models/productmodel');

// Add to cart controller
exports.addToCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = req.user; // Assuming user object is already populated in the request

    // Check if the product is already in cart
    const productInCart = user.cart.find(item => item.productId.toString() === productId);

    if (productInCart) {
      // Increase quantity if already in cart
      productInCart.quantity += 1;
    } else {
      // Add new product to cart
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();
    res.redirect('/cart/view');
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).send('Internal Server Error');
  }
};

// View cart controller
exports.viewCart = async (req, res) => {
  try {
    const user = req.user; // Assuming user object is already populated in the request
    await user.populate('cart.productId').execPopulate();
    res.render('cart', { cart: user.cart });
  } catch (err) {
    console.error('Error viewing cart:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Remove from cart controller
exports.removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = req.user; // Assuming user object is already populated in the request

    // Filter out the product to remove from cart
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);

    await user.save();
    res.redirect('/cart/view');
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).send('Internal Server Error');
  }
};
