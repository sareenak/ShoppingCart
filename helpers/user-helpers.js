var db=require('../config/connection')
var collection=require('../config/collections');
const bcryptjs=require('bcryptjs');
const async = require('hbs/lib/async');
// const { response } = require('express');
var objectId=require('mongodb').ObjectId
const { USER_COLLECTION } = require('../config/collections');
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcryptjs.hash(userData.password,10);
           let user= db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                data.user=user
                resolve(data)
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcryptjs.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("login success")
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("login failed")
                        resolve({status:false})
                    }
                })
            }else{
                console.log("signup")
                resolve({status:false})
            }
        })
    },
    addToCart:(prodid,userid)=>{
        let proObj={
            item:objectId(prodid),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userid)})
           if(userCart){
               let proExist=userCart.products.findIndex(product=>product.item==prodid)
               console.log(proExist);
               if(proExist!=-1){
                   db.get().collection(collection.CART_COLLECTION).updateOne(
                       { 
                           'products.item':objectId(prodid)},
                           {
                               $inc:{'products.$.quantity':1}
                           }

                        ).then(()=>{
                            resolve()
                        })
   
               }else{
               db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userid)},{
                  
                $push:{products:proObj}
               
            }).then((response)=>{
                   resolve()
               }) }

           } else{
               let cartobj={
                   user:objectId(userid),
                   products:[proObj]
               }
               db.get().collection(collection.CART_COLLECTION).insertOne(cartobj).then((response)=>{
                   resolve()
               })
           }
        
        })

        

    },
    getCartProducts:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                $match:{user:objectId(userid)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
               
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,
                        product:{$arrayElemAt:["$product",0]}
                    }

                }

                 ]).toArray()
                        
                        resolve(cartItems)
        })
    },
    getCartCount:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            let count=0
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userid)})
            if(cart){
                count=cart.products.length
            }
            resolve(count)
        })
        
    },
    changeQuantity:(cartObj)=>{
        count=parseInt(cartObj.count)
        quantity=parseInt(cartObj.quantity)
        return new Promise((resolve,reject)=>{
            if(cartObj.count==-1 && cartObj.quantity==1){
                db.get().collection(collection.CART_COLLECTION).
                updateOne({ _id:objectId(cartObj.cart)},
                {
                    $pull:{products:{item:objectId(cartObj.product)}}

                }).then((response)=>{
                    resolve({removeProduct:true}) 
                })
                }else{
            db.get().collection(collection.CART_COLLECTION).
            updateOne(
                { 
                   _id:objectId(cartObj.cart),'products.item':objectId(cartObj.product)},
                    {
                        $inc:{'products.$.quantity':count}
                    }

                 ).then((response)=>{
                     resolve(true)
                 })
            
            }
             })
            },
            removeProductCart:(cartRemove)=>{
                return new Promise((resolve,reject)=>{
                    db.get().collection(collection.CART_COLLECTION).
                updateOne({ _id:objectId(cartRemove.cart1)},
                {
                    $pull:{products:{item:objectId(cartRemove.product1)}}

                }).then((response)=>{
                    resolve({removeProducts:true}) 
                })
                })
            },
            getTotalAmount:(userId)=>{
                return new Promise(async(resolve,reject)=>{
                    let total=await db.get().collection(collection.CART_COLLECTION).aggregate([
                        {
                        $match:{user:objectId(userid)}
                        },
                        {
                            $unwind:'$products'
                        },
                        {
                            $project:{
                                item:'$products.item',
                                quantity:'$products.quantity'
                            }
                        },
                       
                        {
                            $lookup:{
                                from:collection.PRODUCT_COLLECTION,
                                localField:'item',
                                foreignField:'_id',
                                as:'product'
                            }
                        },
                        {
                            $project:{
                                item:1,quantity:1,
                                product:{$arrayElemAt:["$product",0]}
                            }
        
                        },
                        {
                        $group:{_id:null,
                            total:{$sum:{$multiply:['$quantity','$price']}}

                        }
                    }
        
                         ]).toArray()
                                
                                resolve(total[0].total)
                })

            }
}