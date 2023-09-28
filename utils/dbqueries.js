const Cart = require('../models/cart');
const User = require('../models/users')
const Product = require('../models/products')
const db = require('../models/db');

function findUser(query){
    return new Promise((resolve, reject)=>{
        db.query(`select * from ecom_users where email="${query.email}"`,(err,res)=>{
            if(err){
                reject(err);
            } 
            resolve(res);
        })
    })
}

function createUserAccount(user){
    return new Promise((resolve, reject)=>{
        db.query(`insert into ecom_users (id, name, email, password, gender, mobile, isVerified, role) values ("${user.id}","${user.name}","${user.email}","${user.password}","${user.gender}","${user.mobile}",false,"user")`,(err,res)=>{
            if(err){
                reject(err);
            }
            resolve(res);
        })
    })
}

function updateUser(query){
    return new Promise((resolve, reject)=>{
        db.query(`update ecom_users set isVerified= true where id = "${query.id}"`, (err,data)=>{
            if(err){
                reject(err);
            }
            resolve(data);
        })
    })
}

function findUserAndUpdate(query){

    return new Promise((resolve,reject)=>{
        db.query(`select password from ecom_users where id = "${query.id}"`,(err,res)=>{
            if(err){
                reject(err);
            }
            if(res.length>0){
                if(res[0].password==query.old_password){
                    db.query(`update ecom_users set password="${query.new_password}" where id = "${query.id}"`,(err,result)=>{
                        if(err){
                            reject(err);
                        }
                        resolve(result);
                    })
                }
            }
        })
    })
}

function resetPassword(query){
    return new Promise((resolve, reject)=>{
        db.query(`update ecom_users set password = "${query.new_password} where id = "${query.id}"`,(err,result)=>{
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

function findCart(query){
    return new Promise((resolve,reject)=>{
        db.query(`select * from carts where product_id="${query.pid}" and user_id="${query.uid}"`,(err,data)=>{
            if(err){
                reject(err)
            }
            resolve(data);
        })    
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

function getAllCarts(query){
    return new Promise((resolve,reject)=>{
        db.query(`select * from products cross join carts on products.p_id = carts.product_id where user_id= "${query.uid}";`,(err, pids)=>{
            if(err){
                reject(err)
            }
            console.log(pids);

        })
    })
}

function deleteCartItem(query){
    return new Promise((resolve, reject)=>{
        db.query(`delete from carts where user_id="${query.uid}" and product_id="${query.pid}"`,(err, res)=>{
            if(err){
                reject(err);
            }
            resolve(res);
        })
    })
}

function updateProduct(query){
    return new Promise((resolve, reject)=>{
        db.query(`update products set name="${query.name}", description="${query.description}", price="${query.price}", quantity="${query.quantity}" where p_id="${query.p_id}"`,(err,res)=>{
            if(err){
                reject(err);
            }
            resolve(res);
        })
    })
}

function addItemToCart(query){
    return new Promise((resolve,reject)=>{
        db.query(`insert into carts values("${query.pid}","${query.uid}","${query.quantity}")`,(err,res)=>{
            if(err){
                reject(err)
            }
            resolve(res);
        })
    })
}

function updateCart(query){
    return new Promise((resolve, reject)=>{
        db.query(`update carts set order_quantity = "${query.quantity}" where product_id="${query.pid}" and user_id="${query.uid}"`,(err,res)=>{
            if(err){
                reject(err);
            }
            resolve(res);
        })
    })
}


module.exports = {addItemToCart,findUser, updateUser,findUserAndUpdate, findCart, findProduct, getAllCarts, updateCart, updateProduct, createUserAccount, resetPassword}