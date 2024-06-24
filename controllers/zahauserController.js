/*const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const Product = require('../models/productmodel');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password'  // Replace with your email password or app-specific password
  }
});

const userController = {
  // Sign up a new user
  signUp: async (req, res) => {
    try {
      const { fullname, phoneNumber, city, address, locationDetails, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        fullname,
        email,
        phoneNumber,
        city,
        address,
        locationDetails,
        password: hashedPassword,
      });

      await newUser.save();

      req.session.userId = newUser._id;
      req.session.authenticated = true;

      res.redirect('/myprofile');

    } catch (err) {
      console.error('Error during signup:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Sign in a user
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      req.session.userId = user._id;
      req.session.authenticated = true;

      if (email === 'admin@gmail.com') {
        res.redirect('/dashboard');
      } else {
        res.redirect('/myprofile');
      }

    } catch (error) {
      console.error('Error during signin:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Fetch user profile
  getUserProfile: async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.render('myprofile', { user });

    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update user information
  updateUser: async (req, res) => {
    try {
      const userId = req.session.userId;
      const { newemail, newFullname, newPhoneNumber, newCity, newAddress, newLocationDetails, newPassword } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const errors = [];
      if (newFullname && newFullname.trim().length === 0) {
        errors.push('Fullname cannot be empty');
        console.log('Validation error: Fullname cannot be empty');
      }
  
      if (newemail && !/\S+@\S+\.\S+/.test(newemail)) {
        errors.push('Must be a valid email');
        console.log('Validation error: Must be a valid email');
      }
  
      if (newPhoneNumber && !/^(010|011|012|015)\d{8}$/.test(newPhoneNumber)) {
        errors.push('Must be a valid phone number');
        console.log('Validation error: Must be a valid phone number');
      }
  
      if (newCity && newCity.trim().length === 0) {
        errors.push('City cannot be empty');
        console.log('Validation error: City cannot be empty');
      }
  
      if (newAddress && newAddress.trim().length === 0) {
        errors.push('Address cannot be empty');
        console.log('Validation error: Address cannot be empty');
      }
  
      if (newLocationDetails && newLocationDetails.trim().length === 0) {
        errors.push('Location details cannot be empty');
        console.log('Validation error: Location details cannot be empty');
      }
  
      if (newPassword && (newPassword.length < 8 || !/[A-Z]/.test(newPassword))) {
        errors.push('Password must be at least 8 characters long and contain at least one capital letter');
        console.log('Validation error: Password must be at least 8 characters long and contain at least one capital letter');
      }
  
      if (errors.length > 0) {
        console.log('Validation errors:', errors);
        return res.status(400).json({ errors });
      }
  
      if (newemail) {
        user.email = newemail;
        console.log('Updated email:', newemail);
      }
      if (newFullname) {
        user.fullname = newFullname;
        console.log('Updated fullname:', newFullname);
      }
      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
        console.log('Updated password (hashed):', user.password);
      }
      if (newPhoneNumber) {
        user.phoneNumber = newPhoneNumber;
        console.log('Updated phone number:', newPhoneNumber);
      }
      if (newCity) {
        user.city = newCity;
        console.log('Updated city:', newCity);
      }
      if (newAddress) {
        user.address = newAddress;
        console.log('Updated address:', newAddress);
      }
      if (newLocationDetails) {
        user.locationDetails = newLocationDetails;
        console.log('Updated location details:', newLocationDetails);
      }

      await user.save();
      res.status(200).json({ message: 'User updated successfully' });

    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete user account
  deleteUser: async (req, res) => {
    try {
      const email = req.params.email;
      const user = await User.findOneAndDelete({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Handle forgot password request
  forgotPassword: async (req, res) => {
    const { email, phoneNumber } = req.body;

    try {
      const user = await User.findOne({ email, phoneNumber });

      if (!user) {
        return res.status(404).send('User not found');
      }

      const mailOptions = {
        to: user.email,
        from: 'your-email@gmail.com',
        subject: 'Your Password',
        text: `Your password is: ${user.password}`
      };

      await transporter.sendMail(mailOptions);

      res.status(200).send('Your password has been sent to your email');

    } catch (error) {
      console.error('Error sending password:', error);
      res.status(500).send('Error sending the password');
    }
  },


  
 logout:(req, res) => {
  try {
    // Destroy session
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.status(200).json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
}

};



module.exports = userController;*/
