const db = require('../models/db');

function findUser(query) {
    return new Promise((resolve, reject) => {
        db.query(`select * from ${query.table} where email="${query.email}"`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        })
    })
}

function createUserAccount(user) {
    return new Promise((resolve, reject) => {
        db.query(`insert into ecom_users values ("${user.id}","${user.name}",
        "${user.email}","${user.gender}","${user.mobile}",
        false,"user","${user.password}")`,
            (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
    })
}

function createSellerAccount(seller, files) {
    return new Promise((resolve, reject) => {
        db.query(`insert into sellers values("${seller.id}","${seller.fname}","${seller.lname}","${seller.gender}",
        "${seller.email}","${seller.mobile}","${seller.dob}","${seller.buisnessName}","${seller.buisnessAddress}",
        "${seller.aadharNumber}","${seller.panNumber}","${seller.gstNumber}","${files[0].filename}",
        "${files[1].filename}","${files[2].filename}","${files[3].filename}",false, false, "seller","${seller.password}","${seller.pincode}","${seller.city}")`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

function updateUser(query) {
    return new Promise((resolve, reject) => {
        db.query(`update ${query.table} set ${query.modField} = true where ${query.queField} = "${query.id}"`, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    })
}

function findUserAndUpdate(query) {

    return new Promise((resolve, reject) => {
        db.query(`select password from ${query.table} where ${query.field} = "${query.id}"`, (err, res) => {
            if (err) {
                reject(err);
            }
            if (res.length > 0) {
                if (res[0].password == query.old_password) {
                    db.query(`update ecom_users set password="${query.new_password}" where id = "${query.id}"`, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(result);
                    })
                }
            }
        })
    })
}

function resetPassword(query) {
    return new Promise((resolve, reject) => {
        db.query(`update ${query.table} set password = "${query.new_password}" where ${query.field} = "${query.id}"`, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
}

function findCart(query) {
    return new Promise((resolve, reject) => {
        db.query(`select * from carts where product_id="${query.pid}" and user_id="${query.uid}"`, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data);
        })
    })
}

function findProduct(pid) {
    return new Promise((resolve, reject) => {
        db.query(`select * from products where p_id = "${pid}"`, (err, product) => {
            if (err) {
                reject(err)
            }
            resolve(product);
        })
    })
}

function getAllCarts(query) {
    return new Promise((resolve, reject) => {
        db.query(`select * from products cross join carts on products.p_id = carts.product_id where user_id= "${query.uid}";`, (err, cartItems) => {
            if (err) {
                reject(err)
            }
            console.log(cartItems);
            resolve(cartItems)
        })
    })
}

function deleteCartItem(query) {
    return new Promise((resolve, reject) => {
        db.query(`delete from carts where user_id="${query.uid}" and product_id="${query.pid}"`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        })
    })
}

function updateProduct(query) {
    return new Promise((resolve, reject) => {
        db.query(`update products set name="${query.name}", description="${query.description}", price="${query.price}", quantity="${query.quantity}" where p_id="${query.p_id}"`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        })
    })
}

function addItemToCart(query) {
    return new Promise((resolve, reject) => {
        db.query(`insert into carts(product_id,user_id,order_quantity,sub_total,org_price) values("${query.pid}","${query.uid}","${query.quantity}","${query.sub_total}","${query.price}")`, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(res);
        })
    })
}

function updateCart(query) {
    return new Promise((resolve, reject) => {
        db.query(`update carts set order_quantity = "${query.quantity}", sub_total = "${query.sub_total}" where product_id="${query.pid}" and user_id="${query.uid}"`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        })
    })
}

function addProduct(query) {
    return new Promise((resolve, reject) => {
        db.query(`insert into products 
        values("${query.p_id}",
                "${query.name}",
                "${query.description}",
                ${query.price},
                ${query.quantity},
                "${query.image}",
                "${query.seller_id}",
                "pending")`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        })
    })
}

function getSellerProducts(query) {
    return new Promise((resolve, reject) => {
        const page = query.page || 1;
        const pageSize = 5;
        const startIndex = (page - 1) * pageSize;
        db.query(`select * from products where seller_id = "${query.seller_id}" limit ${pageSize} offset ${startIndex}`, (err, products) => {
            if (err) {
                reject(err)
            }
            resolve(products)
        })
    })
}

function deleteProductFromTable(query) {
    return new Promise((resolve, reject) => {
        db.query(`delete from products where p_id="${query.p_id}"`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        })
    })
}

function place_order(query) {
    return new Promise((resolve, reject) => {
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
            (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
    })
}

function getAllOrders(query) {
    return new Promise((resolve, reject) => {
        db.query(`select * from orders cross join products on orders.p_id = products.p_id where ${query.field} = "${query.value}"`, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    })
}

function updateOrder(query) {
    return new Promise((resolve, reject) => {
        db.query(`update orders set ${query.qry} where order_id="${query.oid}"`, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            console.log(data);
            resolve(data)
        })
    })
}

function updateOrderTrackInfo(query) {
    return new Promise((resolve, reject) => {
        db.query(`update trackorders set ${query.qry} where oid = "${query.oid}"`, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            console.log(data);
            resolve(data)
        })
    })
}

function getNewOrdersForSeller(query) {
    return new Promise((resolve, reject) => {
        if (query.dispatched) {
            db.query(`select products.*, orders.*, shippers.name, shippers.center from orders cross join products on orders.p_id = products.p_id join trackorders on orders.order_id = trackorders.oid join shippers on shippers.shipper_id = trackorders.shipper1_id where products.seller_id = "${query.sid}" and status="${query.sts}"`, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err)
                }
                console.log(data);
                resolve(data);
            })
        } else {
            db.query(`select * from orders cross join products on orders.p_id = products.p_id where products.seller_id = "${query.sid}" and status="${query.sts}"`, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err)
                }
                // console.log(data);
                resolve(data)
            })
        }
    })
}

function getDispatchedOrdersDb(query) {
    return new Promise((resolve, reject) => {
        db.query(`select shipper1_id from trackorders cross join orders on oid=order_id where order_id="${query.oid}"`, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            if (data.length > 0) {
                db.query(`select center, center_number, name, mobile, email from shippers where shipper_id=${data[0].shipper1_id}`, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    // console.log(res);
                    resolve(res);
                })
            } else {
                resolve(data)
            }
        })
    })
}

function getNearByCenter(query) {
    return new Promise((resolve, reject) => {
        db.query(`select shipper_id, name, mobile, email, center, center_number, pincode, city from shippers where city = "${query.city}"`, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    })
}

function getAllSellerReq(qry) {
    return new Promise((resolve, reject) => {
        db.query(`select ${qry} from sellers where isApproved = false`, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    })
}

function getUnApprovedProductsDb() {
    return new Promise((resolve, reject) => {
        db.query(`select * from products cross join sellers on products.seller_id = sellers.seller_id where products.isApproved = "pending" `, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data);
        })
    })
}

function getShipments(query) {
    return new Promise((resolve, reject) => {
        let qry = "";
        if (query.sts == "new")
            qry = `select * from trackorders join orders on order_id = oid where shipper1_id = ${query.id} and S1receive_date is NULL or shipper2_id = ${query.id} and S2receive_date is NULL`;
        else if (query.sts == "deliver")
            qry = `select orders.shipping_address, orders.order_id, trackorders.* from trackorders join orders on oid = order_id where S2receive_date is NOT NULL and shipper2_id = ${query.id} and deliveryPerson_id is NULL`
        else if (query.sts == "dispatchNext")
            qry = `select orders.shipping_address, orders.order_id, trackorders.*, shippers.shipper_id, shippers.center from trackorders join orders on oid = order_id join shippers on shippers.city = orders.city  where shipper1_id = ${query.id} and S1receive_date is NOT NULL and shipper2_id is NULL`
        else if (query.sts == "dispatchedToNext")
            qry = `select orders.shipping_address, orders.order_id, shippers.center from trackorders join orders on oid = order_id join shippers on shippers.shipper_id = trackorders.shipper2_id where shipper1_id = ${query.id} and shipper2_id is NOT NULL and orders.status<>"delivered"`
        else if (query.sts == "delivering")
            qry = `select orders.shipping_address, orders.order_id, shippers.name, trackorders.*, deliverypersons.name as Dname from trackorders join orders on oid = order_id join shippers on shippers.shipper_id = trackorders.shipper2_id join deliverypersons on deliverypersons.delp_id = trackorders.deliveryPerson_id where shipper2_id = ${query.id} and deliveryPerson_id is NOT NULL and orders.status<>"delivered"`

        db.query(qry, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            console.log(data);
            resolve(data)
        })
    })
}

function getDeliveryPersons(query) {
    return new Promise((resolve, reject) => {
        db.query(`select name as Dname, delp_id from deliverypersons where city = "${query.city}"`, (err, r) => {
            if (err) {
                reject(err)
            }
            resolve(r)
        })
    })
}

function getTrackingStatus(query) {
    return new Promise((resolve, reject) => {
        db.query(`select trackorders.*, orders.status, s1.center as center1, s2.center as center2, deliverypersons.name as deliveryPartnerName, deliverypersons.mobile as deliveryPartnerMobile from trackorders join orders on oid = order_id join shippers as s1 on shipper1_id = s1.shipper_id join shippers as s2 on shipper2_id = s2.shipper_id join deliverypersons on delp_id = deliveryPerson_id where order_id = "${query.oid}"`, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            console.log(data);
            resolve(data)
        })
    })
}

function updateShipmentDb(query) {
    return new Promise((resolve, reject) => {
        db.query(`update trackorders set ${query.qry} where oid = "${query.oid}"`, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    })
}

function uploadBulkProducts(filepath) {
    return new Promise((resolve,reject)=>{
        db.query(`LOAD DATA INFILE '${filepath}'
            INTO TABLE products
            FIELDS TERMINATED BY ';'
            LINES TERMINATED BY '\n'`,
            (err, res) => {
                if (err) {
                    reject(err)
                } 
                resolve(res)
        });
    })

}

function getAllOrderReport(query){
    return new Promise((resolve,reject)=>{
        db.query(`SELECT 
        orders.city,
        orders.p_id,
        orders.status,
        SUM(orders.order_quantity) AS total_order_quantity,
        count(orders.order_id) as order_placed,
        products.name
        FROM orders
        JOIN products ON orders.p_id = products.p_id
        WHERE orders.seller_id = "${query.id}"
        GROUP BY ${query.filter}`,
        (err,data)=>{
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}

function getAllProductsReport(query){
    return new Promise((resolve, reject)=>{
        db.query(`select products.p_id, products.name, products.quantity, products.price from products where seller_id="${query.id}"`,(err,data)=>{

        })
    })
}

function getDeliveries(query){
    return new Promise((resolve,reject)=>{
        db.query(`select orders.order_id, orders.shipping_address, orders.pincode, orders.city, orders.delivery_date, orders.bill, orders.payment_status, orders.status from orders join trackorders on trackorders.oid = orders.order_id where trackorders.deliveryPerson_id = '${query.id}' and orders.status = '${query.status}'`,(err,data)=>{
            if(err){
                console.log(err);
                reject(err)
            }
            console.log(data);
            resolve(data)
        })
    })
}

function markItemDelivered(query){
    return new Promise((resolve,reject)=>{
        db.query(`UPDATE orders
        SET delivery_date = NOW(),
            status = 'delivered',
            payment_status = 'paid'
        WHERE order_id = '${query.oid}'
          AND order_id IN (
            SELECT oid
            FROM trackorders
            WHERE deliveryPerson_id = ${query.id}
          );`,(err,data)=>{
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
    getNearByCenter,
    getAllSellerReq,
    getUnApprovedProductsDb,
    updateOrderTrackInfo,
    getDispatchedOrdersDb,
    getShipments,
    updateShipmentDb,
    getDeliveryPersons,
    getTrackingStatus,
    uploadBulkProducts,
    getAllOrderReport,
    getAllProductsReport,
    getDeliveries,
    markItemDelivered
}