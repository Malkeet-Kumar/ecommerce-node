const db = require('../models/db');
const sendMail = require("../utils/email.js")
const {v4:uuid} = require('uuid')
const {createToken,verifyToken} = require('../utils/tokenGenerator.js')
const {findUser,updateUser, findUserAndUpdate, findCart, findProduct, getAllCarts, updateCart, createUserAccount, resetPassword, addItemToCart, deleteCartItem, place_order, getAllOrders, updateOrder} = require('../utils/dbqueries.js')
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
    findUser({table:"ecom_users",email:email})
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
    if(req.session.isLoggedIn && req.session.role=="user"){
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
    if(!req.session.isLoggedIn && req.session.role!="user" && !req.session.user){
        res.redirect("/login")
    }
    const curr_password = req.body.current_password
    const new_password = req.body.new_password
    
    findUserAndUpdate({table:"ecom_users",field:"id",id:req.session.userId,old_password:curr_password,new_password:new_password})
    .then(result=>{
        if(result.changedRows>0){
            res.status(200).send("pass updated successfully !")
        }else {
            res.status(404).send("Somthing went wrong !")
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).send("Internal server error");
    })

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
            res.status(401).send("Invalid Token")
        } else {
            resetPassword({table:"ecom_users",field:"id",id:data.data.id, new_password:new_password})
            .then(result=>{
                console.log(result);
                if(result.changedRows>0){
                    findUser({table:"ecom_users",email:data.data.email})
                    .then((r) => {
                        if(r.length>0){
                            const msg =`
                            <h1>Hi, ${r[0].name}</h1>
                            <p>You account Password has been Resetted succesfully.<br>Thank You</p>`
                            sendMail(r[0].email,r[0].name,msg,"Password Resetted");
                            res.status(303).redirect("/login");
                        } else {
                            res.status(404).send("Something went wrong !");
                        }
                    })
                } else {
                    res.status(404).send("Something went wrong !");
                }
            })
            .catch(err=>{
                console.log(err);
                res.status(500).send("Internal server error");
            })
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
            findUser({table:"ecom_users",email:data.data.email})
            .then((result) => {
                if(result.length<=0){
                    res.status(404).send("User Not Found !");
                }
                updateUser({table:"ecom_users",modField:"isVerified",queField:"id",id:data.data.id})
                .then(d=>{
                    if(d.changedRows>0){
                        console.log(result);
                        res.send("Email verified successfully");
                    } else {
                        console.log(result);
                        res.send("Already verified")
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
    findUser({table:"ecom_users",email: username})
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
    if(req.session.role!="user" && req.session.isLoggedIn){
        res.send("This page is for normal user !")
        return
    }
        res.render("user/home",{username: req.session.name||"Guest",email: req.session.email, userId:req.session.userId, route:"/cart",btnText:"My Cart",loggedin:req.session.isLoggedIn || false});
}


function addToCart(req, res) {
    console.log(req.path);
    const item = req.params.item;
    if(!req.session.isLoggedIn && req.session.role!="user"){
        res.status(302).redirect("/login");
        return;
    }

    findCart({pid: item,uid: req.session.userId})
    .then((result) => {
        if(result.length>0){
            console.log(result,"khkjhkjgjkhjkgjhg");
            updateCart({pid:item,uid:req.session.userId,quantity:result[0].order_quantity+1,sub_total:result[0].org_price*(result[0].order_quantity+1)})
            .then(p=>{
                res.send(p)
            })
        } else{
            findProduct(item)
            .then((result) => {
                if(result.length>0){
                    addItemToCart({pid:item,uid:req.session.userId,quantity:1,sub_total:result[0].price,price:result[0].price})
                    .then((result) => {
                        if(result.affectedRows>0){
                            res.send(result);
                        }
                    })
                }
            })
        }
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
}


function loadMyCart(req,res){
   
    if(!req.session.isLoggedIn && req.session.role!="user"){
        res.redirect("/login")
    } else {
        getAllCarts({uid:req.session.userId})
        .then((result) => {
            if(result.length>0){
                console.log(result);
                res.json(result)
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
    if(!req.session.isLoggedIn && req.session.role!="user"){
        res.redirect("/login");
    } else {
        deleteCartItem({uid:req.session.userId, pid:req.params.item})
        .then(result=>{
            console.log(result);
            if(result.affectedRow>0){
                res.status(200).send("deleted successfully")
            } else {
                res.status(404).send("something went wrong")
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).send(err)
        })
    }
}

function loadMyCartPage(req,res){
    if(!req.session.isLoggedIn && req.session.role!="user"){
        res.redirect("/login")
    } else {
        res.render("user/mycart",{username: req.session.name,email: req.session.email, userId:req.session.userId, route:"/home",btnText:"Back",loggedin: req.session.isLoggedIn ||false});
    }
}

function getOrderPage(req,res){
    if(!req.session.isLoggedIn && req.session.role!="user"){
        res.redirect("/login")
    } else {
        getAllCarts({uid:req.session.userId})
        .then((result) => {
            if(result.length>0){
                let bill;
                db.query(`select sum(sub_total) as bill from carts where user_id="${req.session.userId}"`,(err,data)=>{
                    if(err){
                        res.send(err)
                        return
                    }
                    console.log(data);
                    res.render("user/orderPage",{t_bill:data[0].bill,carts:result,username: req.session.name,email: req.session.email, userId:req.session.userId, route:"/cart",btnText:"Back",loggedin: req.session.isLoggedIn ||false});
                })
            } else {
                res.render("user/orderPage",null)
            }
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    }
}

function placeOrder(req,res){
        const address = req.body.fullname+"\nMobile:"+req.body.mobile+"\n"+req.body.address1+"\n"+req.body.address2+"\n"+req.body.city+"\nPincode:"+req.body.pincode;
        getAllCarts({uid:req.session.userId})
            .then((result) => {
            if(result.length>0){
                console.log(result,"get All carts");
                result.forEach(item => {
                    const order= {
                        o_id:uuid(),
                        p_id:item.p_id,
                        u_id:item.user_id,
                        bill:item.sub_total,
                        addr: address,
                        ordertime: new Date().toISOString(),
                        seller_id:item.seller_id,
                        quantity:item.order_quantity,
                        p_mode:req.body.paymentOption,
                        city:req.body.city,
                        pincode:req.body.pincode
                    }
                    console.log(order);
                    place_order(order)
                    .then((result) => {
                        console.log(result,"when placing order");
                       deleteCartItem({uid:item.user_id,pid:item.p_id})
                       .then(r=>{
                        console.log(r);
                       })
                    })
                });
                res.end("Order placed successfully")
            } else {
                res.status(500).send("Internal server error")
            }
        }).catch((err) => {
            console.log(err);
            res.send(err);
        })
}

function editItemQuantity(req,res){
    console.log(req.body);
    if(!req.session.isLoggedIn && req.session.role!="user"){
        res.redirect("/login")
    } else {
        findCart({pid: req.params.item, uid: req.session.userId})
        .then((result) => {
        if(result.length>0){
            subtotal = result[0].org_price*req.body.quantity;
            updateCart({quantity:req.body.quantity, uid: req.session.userId, pid: req.params.item, sub_total:subtotal})
            .then((result) => {
                console.log(result);
                if(result.changedRows>0){
                    res.status(200).json({quantity : req.body.quantity, sub_total: subtotal});
                } else{
                    res.status(404).send("Something went wrong");
                }
            }).catch((err) => {
                res.status(500).send("Internal Server Error !")
            });
        }})
    }
}

function sendPasswordResetMail(req,res){
    findUser({table:"ecom_users",email:req.body.email})
    .then((result) => {
        if(result.length>0){
            const msg = `<h2>Hello ${result[0].name},</h2>
            <h2>Greetings from WOW BAZZAR,</h2> 
            <p><a href="http://127.0.0.1:8000/forgotpassword/${createToken(req.body.email,result[0].id)}">Click here</a> to Reset the password.</p>`;
            sendMail(req.body.email,result[0].name,msg,"Reset Password");
            res.status(200).send("A Mail has been sent to this account to reset password.")
        } else{
            res.status(404).send("Somthing went wrong !");
        }
    }).catch((err) => {
        console.log(err);
        res.render("user/forgotpassword",{err:"Email does not exists."})
    });
}

function getMyOrders(req,res){
    getAllOrders({field:"u_id",value:req.session.userId})
    .then((result) => {
        console.log(result);
        res.render("user/myOrders",{orders: result,username: req.session.name,email: req.session.email, userId:req.session.userId, route:"/home",btnText:"Back",loggedin: req.session.isLoggedIn ||false})
    }).catch((err) => {
        res.send(err)
    });
}

function cancelOrder(req,res){
    console.log(req.body)
    updateOrder({qry:`status="cancelled", reason="${req.body.reason}", cancellationDate = "${new Date().toISOString()}"`,oid:req.params.id})
    .then((result) => {
        if(result.changedRows>0){
            res.status(200).end()
        } else {
            res.status(404).end()
        }
    }).catch((err) => {
        res.status(500).end()
    });
}

function setSession(req,user){
    req.session.isLoggedIn = true
    req.session.user = true
    req.session.userId = user.id
    req.session.name = user.name
    req.session.role = "user"
    req.session.email = user.email
}

module.exports = {
    loadLoginPage,
    loginUser,
    logoutUser,
    loadSignupPage,
    loadHomePage,
    addToCart,
    loadMyCart,
    removeFromCart,
    loadMyCartPage, 
    createUser, 
    verifyEmail, 
    changepassword,
    loadPasswordPage, 
    loadForgotPassword, 
    sendPasswordResetMail, 
    resetpassword, 
    loadResetPage,
    editItemQuantity,
    placeOrder,
    getOrderPage,
    getMyOrders,
    cancelOrder
}