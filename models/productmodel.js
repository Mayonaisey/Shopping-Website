const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  image1: {
    type: String,
    required: true,
  },
  image2: {
    type: String,
    required: true,
    
  },
  image3: {
    type: String,
    required: false,
    
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sizes: [  
    {
      type: Object,
      required: true,
      
    },
  ],
  type: {
    type: String,
    required: true,
  },
  quantity:[{  //best selling, out of stock
    type: Number, required: true, min: 0, max: 300 
  }],
  rating: [{
    type: Number,
    default: 0,
  }],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

productSchema.statics.findById = function(id) {
  return this.findOne({ _id: id });
};
const Product = mongoose.model("Productmodel", productSchema);

module.exports = Product;
