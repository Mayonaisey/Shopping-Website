const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  image1: {
    type: String,
    required: true,
  },
  image2: {
    type: String,
    required: true,
    default: " ",
  },
  image3: {
    type: String,
    required: false,
    default: "",
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

const Product = mongoose.model("Productmodel", productSchema);

exports.getProductById = (id) => {
  return Product.find(product => product.id == id);
};
module.exports = Product;
