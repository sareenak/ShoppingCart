var express = require('express');
var router = express.Router();

/* GET home page. */
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
  res.render('index', {products,admin:false});
});

module.exports = router;
