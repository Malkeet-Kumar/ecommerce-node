const db = require('../models/db');
const Product = require('../models/products');


function getProducts(req,res){
    const page =  req.params.items || 1;
    const pageSize = req.params.count||5;
    const startIndex = (page-1)*pageSize;
    db.query(`select * from products where isApproved = "approved" limit ${pageSize} offset ${startIndex}`,(err,products)=>{
        if(err){
            res.send(err)
            return
        }
        res.json(products)
    })
}

function getCount(req,res){
    db.query(`select count(p_id) as count from products`,(err,data)=>{
        if(err){
            res.send(err)
        } else {
            res.json({count: data[0].count})
        }
    })
}

module.exports = {getProducts, getCount}