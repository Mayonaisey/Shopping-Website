const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

//request handlers
router.get("/", async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.send(categoryList);
});
 
//adding a category by admin
router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color
});

});
module.exports = router;
