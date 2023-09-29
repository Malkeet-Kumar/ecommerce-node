const Product = require('../models/products.js')
const User = require('../models/users.js')
const {v4:uuid} = require('uuid')
const {findUser, updateProduct, addProduct, deleteProductFromTable } = require('../utils/dbqueries.js')

function loadLoginPage(req,res){
    if(req.session.isLoggedIn && req.session.isAdmin){
        res.redirect("/admin/dashboard");
        return
    }
    res.render("admin/login",{err:null})
}

function loginAdmin(req,res){
    console.log(req.path,req.body);
    findUser({email:req.body.email})
    .then((result) => {
        if(result.length>0){
            if(result[0].password==req.body.password && result[0].role=="admin"){
                setSession(req,result[0])
                res.redirect("/admin/dashboard");
            } else {
                res.render("admin/login",{err:"Invalid Credentials"});
            }
        } else {
            res.render("admin/login",{err:"Invalid Credentials"});
        }
    }).catch((err) => {
        console.log(err);
        res.send("Not found")
    });  
}

function logout(req,res){
    req.session.destroy()
    res.redirect("/admin/login");
}

function loadDashboard(req,res){
    if(req.session.isLoggedIn && req.session.isAdmin){
        res.render("admin/dashboard",{username:req.session.name,userId:req.session.userId,loggedin:true})
        return
    }
    res.redirect("/admin/login");
}

function addNewProduct(req,res){

    if(!req.session.isAdmin && !req.session.isLoggedIn){
        res.redirect("/admin/login")
        return
    }
    const product = {
        p_id:uuid(),
        name: req.body.name,
        description: req.body.desc,
        price: req.body.price,
        quantity: req.body.quantity,
        image: req.file.filename,
    }

    addProduct(product)
    .then((result) => {
        console.log(result);
        if(result.affectedRows>0){
            res.status(200).send(product)
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error")
    });
}

function editProduct(req,res){
    console.log(req.path);
    const p_id = req.params.id
    const product = {
        p_id:p_id,
        name: req.body.name,
        description: req.body.desc,
        price: req.body.price,
        quantity: req.body.quantity,
    }
    updateProduct(product)
    .then((result) => {
        if(result.changedRows>0){
            res.status(200).json(product);
        } else{
            res.status(404).send("Something went wrong");
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).send("Internal sever error")
    });
}

function deleteProduct(req,res){
    const p_id = req.params.id
    deleteProductFromTable({p_id:p_id})
    .then((result) => {
        console.log(result);
        if(result.affectedRows>0){
            res.status(200).send("success")
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server error");
    });
}

function setSession(req,user){
    req.session.isLoggedIn = true
    req.session.name = user.name
    req.session.email = user.email
    req.session.userId = user.id
    req.session.role = user.role
    req.session.isAdmin = true
}
module.exports = {loadLoginPage,loginAdmin,loadDashboard,logout,addNewProduct,editProduct,deleteProduct}