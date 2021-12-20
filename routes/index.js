var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let Product=[
    {
      name:"IPhone 13 Pro Max",
      category:"Phone",
      image:"https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-max-gold-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652956000",
      Description:"A dramatically more powerful camera"
    },
    {
      name:"IPhone 13 Pro Max",
      category:"Phone",
      image:"https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-max-gold-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652956000",
      Description:"A dramatically more powerful camera"

    },
    {
      name:"IPhone 13 Pro Max",
      category:"Phone",
      image:"https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-max-gold-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652956000",
      Description:"A dramatically more powerful camera"
    },
    {
      name:"IPhone 13 Pro Max",
      category:"Phone",
      image:"https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-max-gold-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652956000",
      Description:"A dramatically more powerful camera"
    }
  ]
  res.render('index', {Product });
});

module.exports = router;
