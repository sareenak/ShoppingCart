var express = require('express');
const { helpers } = require('handlebars');
//const { response } = require('../app');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')
var userHelpers=require('../helpers/user-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  producthelpers.getAllProducts().then((product)=>{

  res.render('user/view-products', {product,admin:false,user})})
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')

  }else{
   res.render('user/login',{"loginErr":req.session.loginErr})
   req.session.loginErr=false
  
  }
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
        req.session.loggedIn=true
        req.session.user=response.user
        res.redirect('/')
      }
      else{
        req.session.loginErr="Invalid Username or Password"
        res.redirect('/login')
        
      }
    })
  })
  router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
  })
  router.get('/cart',verifyLogin,(req,res)=>{


    res.render('user/cart')
  })

module.exports = router;
