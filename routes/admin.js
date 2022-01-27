var express = require('express');
const { helpers } = require('handlebars');
//const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')

/* GET users listing. */

router.get('/', function(req, res, next) {
  
  producthelpers.getAllProducts().then((product)=>{
    //console.log(product)
    res.render('admin/view-products',{product,admin:true,user:false})
    

  })
});

  
  router.get('/addproducts',function(req,res,){
    res.render('admin/addproducts',{admin:true})
  }  );
  router.post('/addproducts',(req,res)=>{
    producthelpers.addProduct(req.body,(id)=>{
      let image=req.files.image
      image.mv('./public/product-image/'+id+'.jpg',(err,done)=>{
        if(!err){
          res.render('admin/addproducts',{admin:true});
        }else{
          console.log(err)
        }
      })
      
    })
  });
  router.get('/delete-product/:id',(req,res)=>{
    let prodId=req.params.id
    console.log(prodId)
    producthelpers.deleteProduct(prodId).then((response)=>{
      res.redirect('/admin/',{admin:true})
    })
  })
router.get('/edit-product/:id',async(req,res)=>{
  let product= await producthelpers.getProdcutDetails(req.params.id)
    console.log(product)
   res.render('admin/edit-product',{product,admin:true})
})
router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  producthelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin',{admin:true})
    
    if(req.files.image){
      let image=req.files.image
      image.mv('./public/product-image/'+id+'.jpg')
      

    }

  })
})


module.exports = router;
