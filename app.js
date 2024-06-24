const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const Product = require('./models/productmodel');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
/*const nodemailer = require('nodemailer');*/

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
  secret: 'some secret',
  resave: false,
/*  saveUninitialized: false,//3shan my3melsh session gdeeda m3 kol req
  cookie: { maxAge: 1800000  //30 mins
}*/

  saveUninitialized: true,
  cookie: { secure: false}}
));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

const port = 3000;

//connect db
const dbURl = 'mongodb+srv://hagar2204577:R7nULH9qSYkl5otw@hagar.shuywlc.mongodb.net/alldata?retryWrites=true&w=majority';
mongoose.connect(dbURl, {})
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });



  /////////// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }
  res.redirect('/'); 
}


//hagar
const productRoutes = require('./routes/proudectRoutes');
const userRoutes = require('./routes/userRoutes');
app.use(productRoutes);
app.use(userRoutes);

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});
///////////////////// zahaa //////////////////////////

app.get('/', (req, res) => {
  res.render('accountForm');
});

app.get('/insidewishlist',isAuthenticated, (req, res) => {
  res.render('insidewishlist');
});
app.get('/forget', (req, res) => {
  res.render('forget'); 
});

app.get('/myprofile', isAuthenticated, (req, res) => {
  try {
    const productId=req.params.productId;
    const product=Product.findOne({ _id: productId });
    
    const userId = req.session.userId;
    console.log('User ID from session:', userId); // Log session user ID

    const user = User.findOne({ _id: userId });
    console.log('User found:', user); // Log the user object fetched from MongoDB

    // Assuming User.findOne() returns a promise, handle it appropriately
    user.then((foundUser) => {
      console.log('Found user:', foundUser); // Log the found user object

      if (!foundUser) {
        console.log('User not found'); // Log if user is not found
        return res.status(404).json({ message: 'User not found' });
      }

      // Assuming you're rendering 'myprofile' EJS template with foundUser data
      res.render('myprofile', { user: foundUser });

    }).catch((error) => {
      console.error('Error finding user:', error); // Log any errors encountered
      res.status(500).json({ message: 'Server error' });
    });

  } catch (error) {
    console.error('Error in /myprofile route:', error); // Log any unexpected errors
    res.status(500).json({ message: 'Server error' });
  }
});



 
// Sign up 
app.post('/signup', async (req, res) => {
  try {
    const { fullname, phoneNumber, city, address, locationDetails, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User exists');
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
    console.log('New user created');

    req.session.userId = newUser._id;
    req.session.authenticated = true;
    
    res.redirect('/myprofile');

  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

  


// admin passowrd:  Admin1234567;
// Sign in 

app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Incorrect password');
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
});




// Get user details based on current session
app.get('/user', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log('User ID from session:', userId); // Log session user ID

    if (!userId) {
      console.log('User ID not found in session');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude the password field
    console.log('User found:', user); // Log the user object fetched from MongoDB

    if (!user) {
      console.log('User not found'); // Log if user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user data as JSON
    res.json(user);

  } catch (error) {
    console.error('Error in /user route:', error); // Log any unexpected errors
    res.status(500).json({ message: 'Server error' });
  }
});




app.put('/update', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log('User ID from session:', userId);

    const { newemail, newFullname, newPhoneNumber, newCity, newAddress, newLocationDetails, newPassword } = req.body;
    console.log('Request body:', req.body);

    const user = await User.findById(userId);
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }


    await user.save();
    console.log('User updated successfully');

    res.status(200).json({ message: 'User updated successfully' });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//lw user 3ayz y delete his acc 
app.delete('/delete/:email', isAuthenticated, async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.status(200).json({ message: 'user deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Logout route
app.post('/logout', (req, res) => {
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
});



//forget
app.post('/forgot-password', async (req, res) => {
  const { email, phoneNumber } = req.body;

    const phonevali = /^(010|011|012|015)\d{8}$/;

    // Validate email format
    const emailvali = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
        if (!emailvali.test(email)) {
            return res.status(400).send('Invalid email format');
        }

        if (!phonevali.test(phoneNumber)) {
            return res.status(400).send('Invalid phone number format');
        }

    const user = await User.findOne({ email, phoneNumber });

    if (!user) {
      return res.status(404).send('User not found');
    }
req.redirect('/forget');
    res.status(200).send('Your password has been sent to your email');

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error sending the password');
  }
});

// Middleware to fetch user and populate wishlist
app.get('/wishlist', async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const user = await User.findById(userId).populate('wishlist').exec();
    res.render('wishlist', { wishlistItems: user.wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Route to delete an item from the wishlist
app.delete('/wishlist/:id', async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const itemId = req.params.id;

    // Update the user's wishlist
    await User.findByIdAndUpdate(userId, { $pull: { wishlist: itemId } });

    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ message: 'Failed to remove item' });
  }
});
