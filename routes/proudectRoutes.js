const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/adminchange', productController.getAdminChange);
router.post('/adminchange', productController.postAdminChange);
router.get('/edit/:id', productController.getEditProduct);
router.post('/edit/:id', productController.postEditProduct);
router.get('/delete/:id', productController.deleteProduct);

module.exports = router;
