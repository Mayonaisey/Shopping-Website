const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController');
const cartController = require('../controllers/cartController');

router.get('/', productController.getProducts);
router.get('/:id', productController.showProduct);
router.post('/filter', productController.filterProducts);
// router.post('/:id/add-to-cart', );
router.use(cartController.isAuthenticated); //middleware

 router.post('/:id/cartRoute', cartController.addToCart);

module.exports = router;


//added last line