
// const express = require('express');
// const router = express.Router();
// const checkoutController = require('../controllers/checkoutController');

// // // Route to render checkout page
// // router.get('/', checkoutController.renderCheckoutPage);

// // Route to view order summary
// router.get('/summary', orderController.viewOrderSummary);

// // Route to place order
// router.post('/place', orderController.placeOrder);

// module.exports = router;

const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const cartController = require('../controllers/cartController');
router.use(cartController.isAuthenticated); //middleware

// Route to display checkout page
router.get('/', checkoutController.displayCheckout);


// Route to place an order
router.post('/placeOrder', checkoutController.placeOrder);

module.exports = router;
