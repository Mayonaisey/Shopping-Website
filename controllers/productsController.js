const Product=require('../models/productmodel');



exports.getProducts=async(req, res)=>{
    try {
        const products = await Product.find({});
        res.render('products', { products });
      } catch (err) {
        res.status(500).send('Error fetching products');
      }
};

exports.showProduct = (req, res) => {
  const productId = req.params.id;
  const product = Product.findById(productId);
  if (product) {
      res.render('showProduct', { item: product });
  } else {
      res.status(404).send('Product not found');
  }
};

//hena 3shan a filter through el chosen gender, type... 
//lazem tb2a el hagat fl request
// exports.filterproducts = async (req, res) => {
//     const post = new Post(req.body.);
//     await post.find
//     res.redirect('/filter');
// };