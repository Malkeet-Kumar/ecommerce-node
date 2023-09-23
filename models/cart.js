const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
    userId: {
        type:mongoose.Types.ObjectId,
        ref:"EcommerceUsers"
    },
    itemId:{
        type:mongoose.Types.ObjectId,
        ref:"Ecommerce_products"
    },
    quantity:Number,
})
const Cart = mongoose.model("cart",cartSchema);

module.exports = Cart;