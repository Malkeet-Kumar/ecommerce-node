// const mongoose = require('mongoose');
// module.exports.init = async()=>{
//     await  mongoose.connect(process.env.DB_URL);
// }

const mysql = require('mysql');

module.exports = mysql.createConnection({
    host:"localhost",
    user:"localhost",
    password:"",  
})