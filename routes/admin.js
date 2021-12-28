var express = require('express');
const { helpers } = require('handlebars');
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



module.exports = router;
