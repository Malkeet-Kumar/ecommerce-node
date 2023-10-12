const db = require('../models/db');

function findUser(query){
    return new Promise((resolve, reject)=>{
        db.query(`select * from ${query.table} where email="${query.email}"`,(err,res)=>{
            if(err){
                reject(err);
            } 
            resolve(res);
        })
    })
}

function createUserAccount(user){
    return new Promise((resolve, reject)=>{
        db.query(`insert into ecom_users values ("${user.id}","${user.name}",
        "${user.email}","${user.gender}","${user.mobile}",
        false,"user","${user.password}")`,
        (err,res)=>{
            if(err){
                reject(err);
            }
            resolve(res);
        })
    })
}

function createSellerAccount(seller, files){
    return new Promise((resolve, reject)=>{
        db.query(`insert into sellers values("${seller.id}","${seller.fname}","${seller.lname}","${seller.gender}",
        "${seller.email}","${seller.mobile}","${seller.dob}","${seller.buisnessName}","${seller.buisnessAddress}",
        "${seller.aadharNumber}","${seller.panNumber}","${seller.gstNumber}","${files[0].filename}",
        "${files[1].filename}","${files[2].filename}","${files[3].filename}",false, false, "seller","${seller.password}")`,(err,res)=>{
            if(err){
                reject(err);
            }
            resolve(res);
        });
    })
}

function updateUser(query){
    return new Promise((resolve, reject)=>{
        db.query(`update ${query.table} set ${query.modField} = true where ${query.queField} = "${query.id}"`, (err,data)=>{
            if(err){
                reject(err);
            }
            resolve(data);
        })
    })
}

function findUserAndUpdate(query){

    return new Promise((resolve,reject)=>{
        db.query(`select password from ${query.table} where ${query.field} = "${query.id}"`,(err,res)=>{
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
        db.query(`update ${query.table} set password = "${query.new_password}" where ${query.field} = "${query.id}"`,(err,result)=>{
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

function findProduct(pid){
    return new Promise((resolve, reject)=>{
        db.query(`select * from products where p_id = "${pid}"`,(err,product)=>{
            if(err){
                reject(err)
            }
            resolve(product);
        })
    })
}

function getAllCarts(query){
    return new Promise((resolve,reject)=>{
        db.query(`select * from products cross join carts on products.p_id = carts.product_id where user_id= "${query.uid}";`,(err, cartItems)=>{
            if(err){
                reject(err)
            }
            console.log(cartItems);
            resolve(cartItems)
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
        db.query(`insert into carts(product_id,user_id,order_quantity,sub_total,org_price) values("${query.pid}","${query.uid}","${query.quantity}","${query.sub_total}","${query.price}")`,(err,res)=>{
            if(err){
                reject(err)
            }
            resolve(res);
        })
    })
}

function updateCart(query){
    return new Promise((resolve, reject)=>{
        db.query(`update carts set order_quantity = "${query.quantity}", sub_total = "${query.sub_total}" where product_id="${query.pid}" and user_id="${query.uid}"`,(err,res)=>{
            if(err){
                reject(err);
            }
            resolve(res);
        })
    })
}

function addProduct(query){
    return new Promise((resolve,reject)=>{
        db.query(`insert into products values("${query.p_id}","${query.name}","${query.description}",${query.price},${query.quantity},"${query.image}","${query.seller_id}")`,(err,res)=>{
            if(err){
                reject(err);
            }
            resolve(res);
        })
    })
}

function getSellerProducts(query){
    return new Promise((resolve,reject)=>{
        const page =  query.page || 1;
        const pageSize = 5;
        const startIndex = (page - 1) * pageSize;
        db.query(`select * from products where seller_id = "${query.seller_id}" limit ${pageSize} offset ${startIndex}`,(err,products)=>{
            if(err){
                reject(err)
            }
            resolve(products)
        })
    })
}

function deleteProductFromTable(query){
    return new Promise((resolve, reject)=>{
        db.query(`delete from products where p_id="${query.p_id}"`,(err,res)=>{
            if(err){
                reject(err);
            }
            resolve(res);
        })
    })
}

function place_order(query){  
    return new Promise((resolve, reject)=>{
        db.query(`insert into orders 
        values("${query.o_id}",
                "${query.p_id}",
                "${query.u_id}",
                "${query.bill}",
                "${query.addr}",
                "${query.ordertime}",
                NULL,
                "pending",
                "waiting",
                "${query.seller_id}",
                ${query.quantity},
                "${query.p_mode}",
                NULL,
                NULL,
                "${query.city}",
                "${query.pincode}"
                )`,
                (err, data)=>{
                    if(err){
                        reject(err);
                    }
                    resolve(data);
                }
        )
    })
}

function getAllOrders(query){
    return new Promise((resolve, reject)=>{
        db.query(`select * from orders cross join products on orders.p_id = products.p_id where ${query.field} = "${query.value}"`,(err,data)=>{
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}

function updateOrder(query){
    return new Promise((resolve,reject)=>{
        db.query(`update orders set ${query.qry} where order_id="${query.oid}"`,(err,data)=>{
            if(err){
                console.log(err);
                reject(err)
            }
            console.log(data);
            resolve(data)
        })
    })
}

function getNewOrdersForSeller(query){
    return new Promise((resolve, reject)=>{
        db.query(`select * from orders cross join products on orders.p_id = products.p_id where products.seller_id = "${query.sid}" and status="${query.sts}"`,(err,data)=>{
            if(err){
                console.log(err);
                reject(err)
            }
            console.log(data);
            resolve(data)
        })
    })
}

function getNearByCenter(query){
    return new Promise((resolve, reject)=>{
        db.query(`select shipper_id, name, mobile, email, center, center_number, pincode, city from shippers where city = "${query.city}"`,(err,data)=>{
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}

module.exports = {
    getSellerProducts,
    createSellerAccount,
    addProduct,
    deleteCartItem,
    addItemToCart,
    findUser, 
    updateUser,
    findUserAndUpdate, 
    findCart, 
    findProduct, 
    getAllCarts, 
    updateCart, 
    updateProduct, 
    createUserAccount, 
    resetPassword, 
    deleteProductFromTable,
    place_order,
    getAllOrders,
    getNewOrdersForSeller,
    updateOrder,
    getNearByCenter
}