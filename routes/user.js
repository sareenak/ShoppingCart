//const { json } = require('body-parser');
const { response } = require('express');
var express = require('express');
const { helpers } = require('handlebars');
const async = require('hbs/lib/async');
//const { response } = require('../app');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')
var userHelpers=require('../helpers/user-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.user.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', async function(req, res, next) {
  let user=req.session.user
  
    let cartCount=null;
    if(req.session.user)
 cartCount=await userHelpers.getCartCount(req.session.user._id)
 producthelpers.getAllProducts().then((product)=>{
  res.render('user/view-products', {product,user,cartCount})})

});
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/')

  }else{
   res.render('user/login',{"loginErr":req.session.userLoginErr})
   req.session.userLoginErr=false
  
  }
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
  })
  router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((data)=>{
    console.log(data);
    
    req.session.user=data
   
    req.session.user.loggedIn=true
    
    res.render('user/login')
  })

  })
  
  router.post('/login',(req,res)=>{
    userHelpers.doLogin(req.body).then((response)=>{
      
      if(response.status){
       req.session.user=response.user
        req.session.user.loggedIn=true
        
        res.redirect('/')
      }
      else{
        req.session.userLoginErr="Invalid Username or Password"
        res.redirect('/login')
        
      }
    })
  })
  router.get('/logout',(req,res)=>{
    req.session.user=null
    
    res.redirect('/')
  })
  router.get('/cart',verifyLogin,async(req,res)=>{
     let products= await userHelpers.getCartProducts(req.session.user._id)
     let total=0
     if(products.length>0){
        total=await userHelpers.getTotalAmount(req.session.user._id)
      }
     
    res.render('user/cart',{total,products,user:req.session.user})
  })
  router.get('/add-to-cart/:id',(req,res)=>{
    console.log('api call');
    userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
      res.json({status:true})
    })
  })
  router.post('/change-product-quantity',(req,res)=>{
    userHelpers.changeQuantity(req.body).then(async(response)=>{
      response.total=await userHelpers.getTotalAmount(req.body.user)
      console.log(req.body+"sareenaknnath")

     // console.log(response)

      res.json(response)

    })
  })
  //removing product
  router.delete('/remove-product-cart',(req,res)=>{
    userHelpers.removeProductCart(req.body).then((response)=>{
      res.json({msg:'success'})
    })
  })
  router.get('/place-order',verifyLogin,async(req,res)=>{
   let total=await userHelpers.getTotalAmount(req.session.user._id)
    res.render('user/place-order',{user:req.session.user,total})
  })
  router.post('/place-order',async(req,res)=>{
    console.log(req.body);
    let products=await userHelpers.getCartProductList(req.body.userId)
    let totalPrice= await userHelpers.getTotalAmount(req.body.userId)
    console.log("placeorder products //////////////////////////////////////////////////////////",products);
    userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
      if(req.body['payment']==='COD'){
      res.json({cod_Success:true})
      }
      else{
        userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
            res.json(response)
        })
      }
    })
   // console.log(req.body)
  })
  router.get('/order-placed',(req,res)=>{
    res.render('user/order-placed',{user:req.session.user})
  })
  router.get('/view-orders',async(req,res)=>{
 let orders= await userHelpers.getUserOrders(req.session.user._id)
      res.render('user/view-orders',{user:req.session.user,orders})
    
  })
  router.get('/view-orders-product/:id',async(req,res)=>{
    
  let products= await  userHelpers.getAllOrdersPlaced(req.params.id)
    res.render('user/view-orders-product',{user:req.session.user,products})
  })
  router.post('/verify-payment',(req,res)=>{
    console.log(req.body)
    userHelpers.verifyPayment(req.body).then(()=>{
      
      userHelpers.changePaymentStatus(req.body.order['receipt']).then(()=>{
        console.log(req.body)
        console.log("payment successfull")
        res.json({status:true})
      })
      }).catch((err)=>{
        console.log(err);
        res.json({status:false ,errMsg:'not success'})
      })
  })

module.exports = router;
