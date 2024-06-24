const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/adminuser', userController.getAdminUser);
router.post('/adminuser', userController.postAdminUser);
router.get('/edituser/:id', userController.getEditUser);
router.post('/edituser/:id', userController.postEditUser);
router.get('/deleteuser/:id', userController.deleteUser);

module.exports = router;
