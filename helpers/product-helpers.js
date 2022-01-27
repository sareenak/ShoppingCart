var db=require('../config/connection')
var collections=require('../config/collections');
var objectId=require('mongodb').ObjectId
const async = require('hbs/lib/async');

module.exports={

    addProduct:(product,callback)=>{
        console.log('product ');
        db.get().collection(collections.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
            callback(data.insertedId);
        })

    },
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            adminData.password=await bcryptjs.hash(adminData.password,10);
           let admin= db.get().collection(collections.ADMIN_COLLECTION).insertOne(adminData).then((data)=>{
                data.admin=admin
                resolve(data)
            })
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

    },
    getProdcutDetails:(prodid)=>{
        return new Promise((resolve,reject)=>{
           db.get().collection(collections.PRODUCT_COLLECTION).findOne({_id:objectId(prodid)}).then((product)=>{
               resolve(product)
           })
        })


    },
    updateProduct:(prodid,data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLLECTION).updateOne({_id:objectId(prodid)},{
                $set:{
                    name:data.name,
                    description:data.description,
                    category:data.category
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
    
}