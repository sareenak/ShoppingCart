var db=require('../config/connection')
var collection=require('../config/collections');
const bcryptjs=require('bcryptjs')
const async = require('hbs/lib/async');
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcryptjs.hash(userData.password,10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
            resolve(data.ops[0])
            })
        })
    }
}