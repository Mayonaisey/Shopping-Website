const Product=require('../models/productmodel');



exports.getProducts=async(req, res)=>{
    const products= await Product.find();
    res.render('products', {products});
};

//hena 3shan a filter through el chosen gender, type... 
//lazem tb2a el hagat fl request
// exports.filterproducts = async (req, res) => {
//     const post = new Post(req.body.);
//     await post.find
//     res.redirect('/filter');
// };