/*const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }
  res.redirect('/'); 
}
// Sign up route
router.post('/signup', userController.signUp);

// Sign in route
router.post('/signin', userController.signIn);

// Get user profile
router.get('/myprofile', isAuthenticated, userController.getUserProfile);

// Update user information
router.put('/update', isAuthenticated, userController.updateUser);

// Delete user account
router.delete('/delete/:email', isAuthenticated, userController.deleteUser);

// Forgot password route
router.post('/forgot-password', userController.forgotPassword);

// Logout route
router.post('/logout', logout);

module.exports = router;
*/