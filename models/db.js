const mysql = require('mysql');
const {v4:uuid} = require('uuid')

module.exports = mysql.createConnection({
    database:"ECOM",
    host:"localhost",
    user:"root",
    password:"",  
})


// const con = mysql.createConnection({
//     database:"ECOM",
//     host:"localhost",
//     user:"root",
//     password:"",  
// })

// con.connect(err=>{
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log("connected");
// })

// function addProduct(product){
//     con.query(`insert into products values("${uuid()}","${product.name}","${product.description}",${product.price},${product.quantity},"${product.image}")`,(err,res)=>{
//         if(err){
//             console.log(err);
//             return
//         }
//         console.log(res);
//     })
// }


// fetch("https://dummyjson.com/products")
// .then(res=>res.json())
// .then(products=>{
//     products.products.forEach(product => {
//     const ob = {
        
//         name: product.title,
//         description: product.description,
//         price: product.price,
//         quantity: product.stock,
//         image: product.images[0]
//     }
//     addProduct(ob)
//     }) 
// })
// .catch(err=>console.log(err))