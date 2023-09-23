const Cart = require('../models/cart');
const User = require('../models/users')
const Product = require('../models/products')

function findUser(query,callback){
    User.findOne(query)
    .then((result) => {
        callback(null,result)
    }).catch((err) => {
        callback(err)
    });
}

function updateUser(query,newVal,callback){
    User.updateOne(query,newVal)
    .then(res=>{
        if(res.modifiedCount>0){
            callback(true)
        } else {
            callback(false)
        }
    })
    .catch(err=>{
        callback(false)
    })
}

function findUserAndUpdate(query,newVal,callback){
    User.findOneAndUpdate(query,newVal,{new:true})
    .then(res=>{
        if(res){
            callback(null,res)
        }
    })
    .catch(err=>{
        callback(err)
    })
}

function findCart(query,callback){
    Cart.findOne(query)
    .then(res=>{
        callback(null,res);
    })
    .catch(err=>{
        callback(err);
    })
}

function findProduct(query,callback){
    Product.findOne(query)
    .then(res=>{
        callback(null,res)
    }) 
    .catch(err=>{
        callback(err)
    })
}

function getAllCarts(query,callback){
    Cart.find(query).populate('itemId')
    .then(p=>{
        callback(null,p)
    })
    .catch(err=>{
        callback(err)
    })
}

function updateCart(query,newVal,callback){
    Cart.findOneAndUpdate(query,newVal,{new:true})
    .then(res=>{
        callback(null, res)
    })
    .catch(err=>{
        callback(err)
    })
}

function updateProduct(query,newVal,callback){
    
    Product.findOneAndUpdate(query,newVal,{new:true})
    .then(res=>{
        callback(null,res)
    })
    .catch(err=>{
        callback(err)
    })
}

module.exports = {findUser, updateUser,findUserAndUpdate, findCart, findProduct, getAllCarts, updateCart, updateProduct}