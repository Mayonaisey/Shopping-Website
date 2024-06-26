// const User = require('../models/User');

// exports.renderCheckoutPage = async (req, res) => {
//   try {
//     const user = req.user; // Assuming user object is already populated in the request
//     res.render('checkout', { user });
//   } catch (err) {
//     console.error('Error rendering checkout page:', err);
//     res.status(500).send('Internal Server Error');
//   }
// };
// orderController.js

const User = require('../models/userModel');
const Product = require('../models/productmodel');

// exports.viewOrderSummary = async (req, res) => {
//   try {
//     const user = req.user; // Assuming user object is already populated in the request

//     await user.populate('cart.productId').execPopulate();

//     const totalPrice = user.cart.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

//     res.render('final', { user, totalPrice });
//   } catch (err) {
//     console.error('Error viewing order summary:', err);
//     res.status(500).send('Internal Server Error');
//   }
// };


exports.displayCheckout = async (req, res) => {

  try {
    const user = req.session.userId; // Assuming user object is already populated in the request
    
    if (!user) {
      throw new Error('User not found in request');
    }

    console.log('User object:', user); // Debugging statement

    // Ensure the cart property exists on the user object
    const cart = user.cart || [];

    // Extract product IDs from the user's cart
    const productIds = cart.map(item => item.productId);

    // Fetch product details for all product IDs in the cart
    const products = await Product.find({ _id: { $in: productIds } });

    // Create a map of productId to product details for quick lookup
    const productMap = products.reduce((map, product) => {
      map[product._id] = product;
      return map;
    }, {});

    // Calculate total price and merge product details with cart items
    const cartWithDetails = cart.map(item => {
      const productDetails = productMap[item.productId];
      return {
        ...item,
        product: productDetails
      };
    });

    const totalPrice = cartWithDetails.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    res.render('checkout', { user, cart: cartWithDetails, totalPrice });
  } catch (err) {
    console.error('Error displaying checkout:', err);
    res.status(500).send('Internal Server Error in displayCheckout');
  }
};

  
exports.placeOrder = async (req, res) => {
  try {
    const user = req.user; // Assuming user object is already populated in the request

    // Add cart items to orders
    user.orders.push({
      products: user.cart.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      }))
    });

    // Clear the cart
    user.cart = [];

    await user.save();

    res.redirect('/order/confirmation');
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).send('Internal Server Error placeorder');
  }
};

// Optional: Add an order confirmation view
exports.orderConfirmation = (req, res) => {
  res.render('confirmation'); // Render a confirmation page
};
