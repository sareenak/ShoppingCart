var express = require('express');
const { helpers } = require('handlebars');
//const { response } = require('../app');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')
var userHelpers=require('../helpers/user-helpers')
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
  router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((data)=>{
    console.log(data);
  })

  })
  router.post('/login',(req,res)=>{
    userHelpers.doLogin(req.body).then((response)=>{
      if(response.status){
        res.redirect('/')
      }
      else{
        res.redirect('/login')
      }
    })
  })

module.exports = router;
