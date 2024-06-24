const User = require('../models/userModel');
const Product = require('../models/productmodel');


exports.addToCart = async (req, res) => {
  // if(!req.seesion.userId){
  //   return res.redirect(`/login?redirectTo=${req.originalUrl}`);
  // }
  const {productID}=req.params;
  const {quantity}=req.body;
  try {
    const UserId = req.session.userId;
    const user = await User.findbyId(req.session.userId);

    const productInCart = user.cart.find(item => item.productId.toString() === productId);

    if (productInCart) {
      // Increase quantity if already in cart
      productInCart.quantity +=parseInt(quantity);
    } else {
      // Add new product to cart
      user.cart.push({ productId, quantity :parseInt(quantity)});
    }

    await user.save();
   // res.redirect('/cart');
   //3ayza yrender el [product page]
   res.render('cart',{cart:user.cart,alert:'product added to cart successfully '});
  } catch (err) {
    console.error('Error adding to cart:', err);
   // res.status(500).send('Internal Server Error');
   res.render('cart',{alert:'An error occurred. Please try again!'});
  }
};

// View cart controller
exports.viewCart = async (req, res) => {
  // if(!req.seesion.userId){
  //   return res.redirect(`/myprofile?redirectTo=${req.originalUrl}`);
  // }
  try {
    // const user = await User.findbyId(req.session.userId);
    // await user.populate('cart.productId').execPopulate();
    // res.render('cart', { cart: user.cart });
    const UserId= req.session.userId;
    const user = await User.findById(UserId).populate('cart.productId');
    if(user){
      res.render('cart',{cart:user.cart,alert:null});
    }
    else{
      res.render('cart', { alert: 'User not found' });
    }
  } catch (err) {
    console.error('Error viewing cart:', err);
    res.render('cart', {cart:[], alert: 'An error occurred. Please try again!' });
  }
};

// Remove from cart controller
exports.removeFromCart = async (req, res) => {
  // if(!req.seesion.userId){
  //   return res.redirect(`/login?redirectTo=${req.originalUrl}`);
  // }
  const {productId}=req.params;
  try {
  //  const productId = req.params.productId;
  
    const user = await User.findbyId(req.session.userId);

    // Filter out the product to remove from cart
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
    res.redirect('./accountForm.ejs'); 
  };
