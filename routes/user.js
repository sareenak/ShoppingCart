var express = require('express');
const { helpers } = require('handlebars');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  producthelpers.getAllProducts().then((product)=>{

  res.render('user/view-products', {product,admin:false})})
});
router.get('/login',(req,res)=>{
res.render('user/login')
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
  })

module.exports = router;
