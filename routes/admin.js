var express = require('express');
const { helpers } = require('handlebars');
//const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  producthelpers.getAllProducts().then((product)=>{
    //console.log(product)
    res.render('admin/view-products',{admin:true,product})
    

  })
});
  
  router.get('/addproducts',function(req,res,){
    res.render('admin/addproducts')
  }  );
  router.post('/addproducts',(req,res)=>{
    producthelpers.addProduct(req.body,(id)=>{
      let image=req.files.image
      image.mv('./public/product-image/'+id+'.jpg',(err,done)=>{
        if(!err){
          res.render('admin/addproducts');
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
      res.redirect('/admin/')
    })
  })
router.get('/edit-product/:id',async(req,res)=>{
  let product= await producthelpers.getProdcutDetails(req.params.id)
    console.log(product)
   res.render('admin/edit-product',{product})
})


module.exports = router;
