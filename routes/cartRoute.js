// const express=require ('express');
// const router =express.Router();
// const product =require ('../models/productmodel');
 const User=require('../models/userModel');

// // router.get('/cart',async(req,res)=>{
// //     const cart=req.session.cart||{};
// //     const cartItem=await Promise.all()
// // })
// router.post('/:productId',async(req,res)=>{
//     if(!req.user){
//         return res.redirect('/login');
//     }
//     const productId=req.params.productId;
//     const user=req.user;
//     const productInCart=user.cart.find(item=>item.productId.toString()===productId);
//     if(productInCart){
//         productInCart.quantity+=1;
//     }
//     else{
//         user.cart.push({productID,quantity:1});
//     }
//     await user.save();
//     res.redirect('/cart');
// });
// router.get('/',async(req,res)=>{
//     // if(!req.user){
//     //     return res.redirect('/login');
//     // }
//     await req.user.populate ('cart.productId').execPopulate();
//     res.redirect('cart',{cart:req.user.cart});
// });
//module.export=router;

// const express = require('express');
// const router = express.Router();
// const cartController = require('../controllers/cartController');

// // Route to add a product to the cart
// router.post('/:userId/add-to-cart', cartController.addToCart);

// // Route to get user's cart
// router.get('/:userId/cart', cartController.getCart);

// module.exports = router;

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

 router.use(cartController.isAuthenticated); //middleware
//  router.get('/products/:productId/cartRoute', cartController.addToCart);


// Route to view cart
router.get('/', cartController.viewCart);



// Route to remove item from cart
router.post('/remove/:productId', cartController.removeFromCart);

router.post('/update/:productId', cartController.updateCart);
module.exports = router;
