const Product = require('../models/products.js')
const User = require('../models/users.js')
const {findUser, updateProduct } = require('../utils/dbqueries.js')

function loadLoginPage(req,res){
    if(req.session.isLoggedIn && req.session.isAdmin){
        res.redirect("/admin/dashboard");
        return
    }
    res.render("admin/login",{err:null})
}

function loginAdmin(req,res){
    console.log(req.path,req.body);
    findUser({email:req.body.email, password:req.body.password,role:"admin"},(err,admin)=>{
        if(err){
            res.render("admin/login",{err:"Invalid Credentials"});
        } else {
            setSession(req,admin)
            res.redirect("/admin/dashboard");
        }
    })   
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
        productName: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        quantity: req.body.quantity,
        image: req.file.filename,
    }

    Product.create(product)
    .then(result=>{
        console.log(result);
        res.json(result);
    })
    .catch(err=>{
        console.log(err);
        res.send(err)
    })
}

function editProduct(req,res){
    console.log(req.path);
    const p_id = req.params.id
    const product = {
        productName: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        quantity: req.body.quantity,
    }

    updateProduct({_id:p_id},product,(err,data)=>{
        if(err){
            res.status(500).send("Internal sever error")
        } else {
            res.status(200).json(data)
        }
    })
}

function deleteProduct(req,res){
    const p_id = req.params.id
    Product.deleteOne({_id:p_id})
    .then(result=>{
        res.status(200).send("success")
    })    
    .catch(err=>{
        console.log(err);
        res.status(500).send("Internal Server error");
    })
}

function setSession(req,user){
    req.session.isLoggedIn = true
    req.session.name = user.name
    req.session.email = user.email
    req.session.userId = user._id
    req.session.role = user.role
    req.session.isAdmin = true
}
module.exports = {loadLoginPage,loginAdmin,loadDashboard,logout,addNewProduct,editProduct,deleteProduct}