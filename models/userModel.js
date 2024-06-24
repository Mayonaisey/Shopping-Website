const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
     
       
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    locationDetails: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
      
    },
    cart:[{
        productId:{ type:mongoose.Schema.Types.ObjectId,ref:'Productmodel'},
        quantity:Number
    }],
    orders:[{
        products:[{
            productId:{type:mongoose.Schema.Types.ObjectId,ref:'Productmodel'},
            quantity:Number
        }],
        orderDate:{type:Date,default:Date.now}
    }],
    wishlist:[{
        productId:{ type:mongoose.Schema.Types.ObjectId,ref:'Productmodel'}
    }]
});
 
  
  const user= mongoose.model('userModel', userSchema);
  
  module.exports = user;
  