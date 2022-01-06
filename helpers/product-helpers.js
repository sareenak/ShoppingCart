var db=require('../config/connection')
var collections=require('../config/collections');
var objectId=require('mongodb').ObjectId
const async = require('hbs/lib/async');

module.exports={

    addProduct:(product,callback)=>{
        console.log('product ');
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.insertedId);
        })

    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let product=await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLLECTION).remove({_id:objectId(prodId)}).then((response)=>{
                console.log(response)
                resolve(response)
            })

        })

    }
    
}