const Product = require('../models/products');


function getProducts(req,res){
    const page =  req.params.items || 1;
    const pageSize = 5;
    const startIndex = (page - 1) * pageSize;
    Product.find({}).sort({createdAt:-1,updatedAt:-1,_id:-1}).limit(pageSize).skip(startIndex)
    .then(p=>{
        res.json(p)
    })
    .catch(err=>{
        console.log(err);
    })

}

module.exports = {getProducts}