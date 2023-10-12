const db = require('../models/db');
const Product = require('../models/products');


function getProducts(req,res){
    const page =  req.params.items || 1;
    const pageSize = 5;
    const startIndex = (page - 1) * pageSize;
    db.query(`select * from products limit ${pageSize} offset ${startIndex}`,(err,products)=>{
        if(err){
            res.send(err)
            return
        }
        res.json(products)
    })
}

module.exports = {getProducts}