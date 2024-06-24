const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');

exports.getAdminUser = async (req, res) => {
  try {
    const users = await User.find();
    res.render('adminuser', { users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users: ' + err.message);
  }
};


exports.postAdminUser = [
  body('fullname').isString().withMessage('Full Name must be a string').isAlpha('en-US', { ignore: ' ' }).withMessage('Full Name must contain only letters and spaces'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('phoneNumber').isNumeric().isLength({ min: 10, max: 10 }).withMessage('Please enter a valid 10-digit phone number'),
  body('city').isString().withMessage('City must be a string').isAlpha('en-US', { ignore: ' ' }).withMessage('City must contain only letters and spaces'),
  body('address').isString().withMessage('Address must be a string'),
  body('locationDetails').isString().withMessage('Location Details must be a string'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, phoneNumber, city, address, locationDetails, password } = req.body;

  try {
    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      city,
      address,
      locationDetails,
      password
    });

    await newUser.save();
    res.redirect('/adminuser');
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Error adding user: ' + err.message);
  }
};

exports.getEditUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    res.render('edituser', { user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).send('Error fetching user: ' + err.message);
  }
};

exports.postEditUser = [
  body('fullname').isString().withMessage('Full Name must be a string').isAlpha('en-US', { ignore: ' ' }).withMessage('Full Name must contain only letters and spaces'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('phoneNumber').isNumeric().isLength({ min: 10, max: 10 }).withMessage('Please enter a valid 10-digit phone number'),
  body('city').isString().withMessage('City must be a string').isAlpha('en-US', { ignore: ' ' }).withMessage('City must contain only letters and spaces'),
  body('address').isString().withMessage('Address must be a string'),
  body('locationDetails').isString().withMessage('Location Details must be a string')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.params.id;
  const { fullname, email, phoneNumber, city, address, locationDetails } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      fullname,
      email,
      phoneNumber,
      city,
      address,
      locationDetails,
    });

    res.redirect('/adminuser');
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Error updating user: ' + err.message);
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.redirect('/adminuser');
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Error deleting user: ' + err.message);
  }
};
