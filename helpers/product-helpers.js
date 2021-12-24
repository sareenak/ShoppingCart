var db=require('../config/connection')
var collections=require('../config/collections');
const async = require('hbs/lib/async');

module.exports={

    addProduct:(product,callback)=>{
        console.log('product ');
        db.get().collection('product').insertOne(product).then((data)=>{
            console.log(data);
            callback(data.insertedId);
        })

    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let product=await db.get().collection(collections.PRODUCT_COLLECTION).find().toString()
            resolve(product)
        })
    }
    
}