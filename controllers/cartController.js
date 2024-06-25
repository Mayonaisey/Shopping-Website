const User = require('../models/userModel');
const Product = require('../models/productmodel');


exports.addToCart = async (req, res) => {
  const { productID, quantity, Prodsize } = req.body; // Extract productID, quantity, and size from req.body

  console.log("Product ID:", productID);
  console.log("Quantity:", quantity);
  console.log("Size:", Prodsize);
  try {
    const UserId = req.session.userId;
    const user = await User.findById(req.session.userId);

    const productInCart = user.cart.find(item => item.productId.toString() === productID && item.size===Prodsize );

    if (productInCart) {
      // Increase quantity if already in cart
      productInCart.quantity +=parseInt(quantity);
    } else {
      // Add new product to cart
      parseInt(quantity);
      console.log(quantity);
      user.cart.push({ productId: productID, quantity :parseInt(quantity), size:Prodsize});
    }

    await user.save();
   // res.redirect('/cart'); 
   console.log("data saved successfully");
   //3ayza yrender el [product page]
   res.redirect('/products');
  } catch (err) {
    console.error('Error adding to cart:', err);
   // res.status(500).send('Internal Server Error');
   res.redirect('/products');
  }
};

// View cart controller
exports.viewCart = async (req, res) => {
 
  try {
    const UserId= req.session.userId; 
    console.log("user id is: "+UserId);
    const user = await User.findById(UserId).populate('cart.productId');
console.log("user is :"+user);
    if(user){
      res.render('cart',{user,alert:null});
    }
    else{
      res.redirect('/accountForm');
    }
  } catch (err) {
    console.error('Error viewing cart:', err);
    res.render('cart', {cart:[], alert: 'An error occurred. Please try again!' });
  }
};

// Remove from cart controller
exports.removeFromCart = async (req, res) => {
 
  const {productId}=req.params;
  try {
 
    const user = await User.findbyId(req.session.userId);
    
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);

    await user.save();
    //cart /view a3taked
    res.redirect('/cart');
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.render('cart', { alert: 'An error occurred. Please try again!' });
  }
};
exports.updateCart=async(req,res)=>{
  const {productId}=req.prams;
  const {quantity}=req.body;
  try{
   const UserId=req.session.userId;
   const user=await User.findOne({_id:UserId,'cart.productId':productId});
    const cartItem = user.cart.find(item => item.productId.toString() === productId);
   if(cartItem){
    cartItem.quantity=parseInt(quantity);
    await user.save();
    res.redirect('cart/view');
   }
  }catch (err) {
    console.error('Error updating cart:', err);
    res.render('cart', { alert: 'An error occurred. Please try again!' });
  }
};
  exports.isAuthenticated=async(req, res, next) =>{
    if (req.session.authenticated) {
      return next();
    }
    res.render('./accountForm'); //opens this file but doesn't change the url 
  };
