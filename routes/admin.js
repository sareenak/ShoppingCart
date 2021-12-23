var express = require('express');
const { helpers } = require('handlebars');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name: "iPhone 13 Pro Max",
      category: "Mobile",
      description: "Example",
      image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-max-gold-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652956000"
    },
    {
      name: "iPhone 13 Pro",
      category: "Mobile",
      description: "Example",
      image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-silver-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652954000"
    },
    {
      name: "iPhone 13 Mini ",
      category: "Mobile",
      description: "Example",
      image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-mini-blue-select-2021?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1629842711000"
    }
  ]
  res.render('admin/view-products',{admin:true,products});
  router.get('/addproducts',function(req,res,){
    res.render('admin/addproducts')
  }  );
  router.post('/addproducts',(req,res)=>{
    console.log(req.body);
    console.log(req.files.image);
    producthelpers.addProduct(req.body,(result)=>{
       res.render('admin/addproducts');
    })
  });

});

module.exports = router;
