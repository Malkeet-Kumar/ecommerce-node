const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    gender: String,
    DOB: String,
    mobile: String,
    isVerified:Boolean,
    role:String
})

const User = mongoose.model("EcommerceUsers",userSchema);
module.exports = User