var db=require('../config/connection')
var collection=require('../config/collections');
const bcryptjs=require('bcryptjs');
const async = require('hbs/lib/async');
const Razorpay=require('razorpay')
// const { response } = require('express');
var objectId=require('mongodb').ObjectId
var instance = new Razorpay
({  
    key_id:'rzp_test_9vIa6AQ52ieDoN'
    , 
    key_secret:'8axiTke6uHnkiNKZQV87J4tL'
    ,});
const { USER_COLLECTION, CART_COLLECTION } = require('../config/collections');
const { response } = require('express');
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
              // console.log(proExist);
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
                     resolve({status:true})
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
                        $match:{user:objectId(userId)}
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
                            total:{$sum:{$multiply:['$quantity',{$toInt:'$product.price'}]}}

                        }
                    }
        
                         ]).toArray()
                                //console.log(total[0].total)
                                resolve(total[0].total)
                })

            },
            placeOrder:(order,products,total)=>{
                return new Promise((resolve,reject)=>{
                   // console.log(order,products,total)
                    let status=order['payment']==='COD'?'Placed':'Pending'
                    let orderObj={
                        Delivery:{
                            address:order.address,
                            mobile:order.mobile,
                            pincode:order.pincode
                        },
                        userId:objectId(order.userId),
                        payment:order['payment'],
                        total:total,
                        products:products,
                        status:status,
                        date:new Date()

                    }
                    db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
                        db.get().collection(collection.CART_COLLECTION).deleteOne({user:objectId(order.userId)})
                        resolve(response.insertedId)
                    })

                })

            },
            getCartProductList:(userId)=>{
                return new Promise(async(resolve,reject)=>{
                   let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
                   resolve(cart.products)
                })
            },
            getUserOrders:(userId)=>{
                return new Promise(async(resolve,reject)=>{
                    let orders=await db.get().collection(collection.ORDER_COLLECTION).find({userId:objectId(userId)}).toArray()
                    //console.log(orders)
                    resolve(orders)
                })

            },
            getAllOrdersPlaced:(orderId)=>{
                return new Promise(async(resolve,reject)=>{
                    let orderItems =await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                        {
                        $match:{_id:objectId(orderId)}
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
                                console.log(orderItems)
                                resolve(orderItems)
                })

        },
        generateRazorpay:(orderId,total)=>{
            console.log(orderId)
            return new Promise((resolve,reject)=>{
                
         var options = {
          amount: total,  // amount in the smallest currency unit
          currency: "INR",
          receipt: "order_rcptid_11"+orderId
      };
          instance.orders.create(options, function(err, order) {
         console.log(order);
         resolve(order)
        
  });
       
        
  
                
            })
        }
        }
