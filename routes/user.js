var express = require('express');
const { helpers } = require('handlebars');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  producthelpers.getAllProducts().then((product)=>{

  res.render('user/view-products', {product,admin:false})})
});

module.exports = router;
