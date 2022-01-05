var db=require('../config/connection')
var collection=require('../config/collections');
const bcryptjs=require('bcryptjs');
const async = require('hbs/lib/async');
const { response } = require('express');
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcryptjs.hash(userData.password,10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
        
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
    }
}