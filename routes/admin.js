var express = require('express');
const { helpers } = require('handlebars');
//const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const verifyLogin=(req,res,next)=>{
  if(req.session.admin.loggedIn){
    next()
  }else{
    res.redirect('admin/login')
  }
}

/* GET users listing. */

router.get('/', function(req, res, next) {
 
  let admin=req.session.admin
   console.log(req.session.admin)
   if(admin){
  producthelpers.getAllProducts().then((product)=>{
    //console.log(product)
    res.render('admin/view-products',{product,admin,user:false})
    

  })
}else
res.redirect('/admin/login')
})

router.get('/login',(req,res)=>{
  if(req.session.admin){
    
    res.redirect('admin/view-products')

  }else{
   res.render('admin/login',{"loginErr":req.session.adminLoginErr,admin:true})
   req.session.adminLoginErr=false
  
  }
})
router.post('/login',(req,res)=>{
  producthelpers.doLogin(req.body).then((response)=>{
    
    if(response.status){
      
      req.session.admin=response.admin
      req.session.admin.loggedIn=true

     
        
        res.redirect('/admin')
      
      
    }
    else{
      req.session.adminLoginErr="Invalid Username or Password"
      res.redirect('/admin/login')
      
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.admin=null
  
  res.redirect('/admin/login')
})


  
  router.get('/addproducts',verifyLogin,function(req,res,){
    res.render('admin/addproducts',{admin:req.session.admin})
  }  );
  router.post('/addproducts',(req,res)=>{
    producthelpers.addProduct(req.body,(id)=>{
      let image=req.files.image
      image.mv('./public/product-image/'+id+'.jpg',(err,done)=>{
        if(!err){
          res.render('admin/addproducts',{admin:req.session.admin});
        }else{
          console.log(err)
        }
      })
      
    })
  });
  router.get('/delete-product/:id',verifyLogin,(req,res)=>{
    let prodId=req.params.id
    console.log(prodId)
    producthelpers.deleteProduct(prodId).then((response)=>{
      res.redirect('/admin/',{admin:req.session.admin})
    })
  })
router.get('/edit-product/:id',verifyLogin,async(req,res)=>{
  let product= await producthelpers.getProdcutDetails(req.params.id)
  let admin=req.session.admin
    console.log(product)
   res.render('admin/edit-product',{product,admin})
})
router.post('/edit-product/:id',verifyLogin,(req,res)=>{
  let id=req.params.id
  let admin=req.session.admin
  producthelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    
    if(req.files.image){
      let image=req.files.image
      image.mv('./public/product-image/'+id+'.jpg')
      

    }

  })
})
router.get('/allUsers',verifyLogin,(req,res)=>{
  producthelpers.getallUsers().then((userDetails)=>{
  res.render('admin/allUsers',{userDetails,admin:req.session.admin})})

})
router.get('/view-allOrders',verifyLogin,(req,res)=>{
  if(req.session.admin){
  producthelpers.getallOrders().then((orders)=>{
    
    res.render('admin/view-allOrders',{admin:req.session.admin,orders})
  })
}
else{
  res.redirect('/admin/login')
}
       
     
   })

module.exports = router;
