const Product = require('../models/products.js')
const User = require('../models/users.js')
const Cart = require('../models/cart.js')
const sendMail = require("../utils/email.js")
const {v4:uuid} = require('uuid')
const {createToken,verifyToken} = require('../utils/tokenGenerator.js')
const {findUser,updateUser, findUserAndUpdate, findCart, findProduct, getAllCarts, updateCart, createUserAccount, resetPassword, addItemToCart} = require('../utils/dbqueries.js')
console.log(uuid());
function createUser(req,res){
    const {username, email, password, gender, mobile} = req.body
    const user = {
        id: uuid(),
        name: username,
        email: email,
        password: password,
        gender:gender,
        mobile:mobile,
    }
    findUser({email:email})
    .then(result=>{
        if(result.length>0){
            res.render("user/signup",{err:"This email already exists. Please try another one. Or go back to login."})
            return
        }
        createUserAccount(user)
        .then(response=>{
            console.log(response);
            const msg = `<h2>Hello ${user.name},</h2>
            <h2>Greetings from WOW BAZZAR,</h2>
            <p>You have just registered on Wow Bazzar.</p>
            <p><a href="http://127.0.0.1:8000/verify/email/${createToken(user.email,user.id)}">Click here</a> to verify your account, and to proceed further.</p>`;
            sendMail(user.email,user.name,msg,"Email verification");
            res.send(`<h1>An email has been sent to this email. Please open your mailbox and click on verify to proceed further</h1>`);
        })
    })
    .catch(err=>{
        console.log(err);
    })
}

function loadPasswordPage(req,res){
    if(req.session.isLoggedIn && !req.session.isAdmin){
        res.render("user/changePassword",{err:null});
        return
    } 
    res.redirect("/login")
}

function loadResetPage(req,res){
    res.render("user/resetpassword",{err:null});
}

function changepassword(req,res){
    console.log(req.path);
    if(!req.session.isLoggedIn && !req.session.user){
        res.redirect("/login")
    }
    const curr_password = req.body.current_password
    const new_password = req.body.new_password
    
    findUserAndUpdate({id:req.session.userId,old_password:curr_password,new_password:new_password})
    .then(result=>{
        console.log(result);
    })
    .catch(err=>{
        console.log(err);
    })

    // res.status(200).send("pass updated successfully !")
    // const msg =`
    //     <h1>Hi, ${u.name}</h1>
    //     <p>You account Password has been updated succesfully.<br>Thank You</p>`
    // sendMail(u.email,u.name,msg,"Password Updated");
}

function resetpassword(req,res){

    const new_password = req.body.new_password
    const token = req.params.token
    verifyToken(token,(err,data)=>{
        if(err){
            res.send("Invalid Token")
        } else {
            resetPassword({id:data.data.id, new_password:new_password})
            .then(result=>{
                console.log(result);
            })
            .catch(err=>{
                console.log(err);
            })
            // const msg =`
            // <h1>Hi, ${updatedUser.name}</h1>
            // <p>You account Password has been Resetted succesfully.<br>Thank You</p>`
            // sendMail(updatedUser.email,updatedUser.name,msg,"Password Resetted");
            // res.status(200).send("Password Resetted Successfully !")
        }
    })
}

function verifyEmail(req,res){
    const token = req.params.token
    verifyToken(token,(err,data)=>{
        if(err){
            console.log(err);
            res.status(404).send("Invalid token");
        } else {
            console.log(data.data.email)
            findUser({email:data.data.email})
            .then((result) => {
                if(result.length<=0){
                    res.status(404).send("User Not Found !");
                }
                updateUser({id:data.data.id})
                .then(d=>{
                    if(d.changedRows>0){
                        console.log(result);
                        res.send("Email verified successfully");
                    }
                })
            }).catch((err) => {
                console.log(err);
                res.status(500).send(err)
            });
        }
    })
}


function loadSignupPage(req,res){
    res.render("user/signup",{err:null})
}

function loadLoginPage(req,res){
    if(req.session.isLoggedIn){
        res.redirect("/home")
    } else {
        res.render("user/login",{err:null})
    }
}

function loadForgotPassword(req,res){
    res.render("user/forgotpassword",{err:null});
}

function loginUser(req,res){
    const username = req.body.email
    const password = req.body.password
    console.log(username,password);
    findUser({email: username})
    .then(result=>{
        if(result.length>0){
            if(result[0].password==password && result[0].role=="user"){
                setSession(req,result[0]);
                res.redirect("/home")
            } else {
                res.render("user/login",{err: "Invalid Email or Password"});
            }
        } else {
            res.render("user/login",{err: "Invalid Email or Password"});
        }
        console.log(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).send("Internal server error")
    })
}

function logoutUser(req,res){
    req.session.destroy();
    res.redirect("/login");
}

function loadHomePage(req,res){
    if(req.session.isAdmin){
        res.send("Admin can not access this page please logout first")
        return
    }
        res.render("user/home",{username: req.session.name||"Guest",email: req.session.email, userId:req.session.userId, route:"/cart",btnText:"My Cart",loggedin:req.session.isLoggedIn || false});
}


function addToCart(req, res) {

    console.log(req.path);
    const item = req.params.item;
    if(!req.session.isLoggedIn){
        res.status(302).redirect("/login");
        return;
    }

    findCart({pid: item,uid: req.session.userId})
    .then((result) => {
        if(result.length>0){
            updateCart({pid:item,uid:req.session.userId,quantity:result[0].order_quantity+1})
            .then(p=>{
                res.send(p)
            })
        } else{
            addItemToCart({pid:item,uid:req.session.userId,quantity:1})
            res.send(result);
        }
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
}


function loadMyCart(req,res){
   
    if(!req.session.isLoggedIn){
        res.redirect("/login")
    } else {
        getAllCarts({uid:req.session.userId})
        .then((result) => {
            if(result.length>0){
                console.log(result);
            } else {
                res.json([]);
            }
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    }
}

function removeFromCart(req,res){
    console.log(req.params.item);
    if(!req.session.isLoggedIn){
        res.redirect("/login");
    } else {
        Cart.deleteOne({_id: req.params.item})
        .then(result=>{
            res.send({status:true})
        })
        .catch(err=>{
            res.send({status:false})
        })
    }
}

function loadMyCartPage(req,res){
    if(!req.session.isLoggedIn){
        res.redirect("/login")
    } else {
        res.render("user/mycart",{username: req.session.name,email: req.session.email, userId:req.session.userId, route:"/home",btnText:"Back",loggedin: req.session.isLoggedIn ||false});
    }
}

function editItemQuantity(req,res){
    console.log(req.body);
    if(!req.session.isLoggedIn){
        res.redirect("/login")
    } else {
        updateCart({_id:req.params.item},{quantity:req.body.quantity},(err,data)=>{
            if(err){
                res.status(500).send("Internal Server Error !")
                return
            }
            res.status(200).json({quantity : data.quantity});
        })
    }
}

function sendPasswordResetMail(req,res){
    findUser({email:req.body.email},(err,user)=>{
        console.log(err, user);
        if(err){
            res.render("user/forgotpassword",{err:"Email does not exists."})
        } else {
            const msg = `<h2>Hello ${user.name},</h2>
            <h2>Greetings from WOW BAZZAR,</h2> 
            <p><a href="http://127.0.0.1:8000/forgotpassword/${createToken(req.body.email, user._id)}">Click here</a> to Reset the password.</p>`;
            sendMail(req.body.email,user.name,msg,"Reset Password");
            res.status(200).send("A Mail has been sent to this account to reset password.")
        }
    })
}

function setSession(req,user){
    req.session.isLoggedIn = true
    req.session.user = true
    req.session.userId = user.id
    req.session.name = user.name
    req.session.email = user.email
}

module.exports = {loadLoginPage,loginUser,logoutUser,loadSignupPage,loadHomePage,
         addToCart,loadMyCart,removeFromCart,loadMyCartPage, createUser, verifyEmail, changepassword,
        loadPasswordPage, loadForgotPassword, sendPasswordResetMail, resetpassword, loadResetPage,
        editItemQuantity}