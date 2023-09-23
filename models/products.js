const mongoose = require('mongoose');
const productScheme = mongoose.Schema({
    productName:String,
    desc:String,
    price:Number,
    quantity:Number,
    image:String
},{timestamps:true});
const Product = mongoose.model("Ecommerce_products",productScheme);
module.exports = Product;