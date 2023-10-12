const {createToken} = require('../utils/tokenGenerator')
const sendMail = require('../utils/email')
const {v4:uuid} = require('uuid')
const {findUser, updateProduct, addProduct, deleteProductFromTable, createSellerAccount, getSellerProducts, getNearByCenter, getNewOrdersForSeller, updateOrder } = require('../utils/dbqueries.js')

function signUpSeller(req,res){
    const ob = {id: uuid(),...req.body}
    findUser({table:"sellers",email:req.body.email})
    .then((result) => {
        if(result.length>0){
            res.send("Already registered")
        } else {
            createSellerAccount(ob, req.files)
            .then((result) => {
                console.log(result);
                const msg = `<h2>Hello ${ob.fname},</h2>
                <h2>Greetings from WOW BAZZAR,</h2>
                <p>You have just registered on Wow Bazzar as a Seller.</p>
                <p><a href="http://127.0.0.1:8000/verify/email/${createToken(req.body.email,ob.id)}">Click here</a> to verify your account, and to proceed further.</p>`;
                sendMail(ob.email,ob.fname,msg,"Email verification");
                res.redirect("/seller/login");
            })
        }
    }).catch((err) => {
        console.log(err);
    });
}

function verifyEmail(req,res){
    const token = req.params.token
    verifyToken(token,(err,data)=>{
        if(err){
            console.log(err);
            res.status(404).send("Invalid token");
        } else {
            console.log(data.data.email)
            findUser({table:"sellers",email:data.data.email})
            .then((result) => {
                if(result.length<=0){
                    res.status(404).send("User Not Found !");
                }
                updateUser({table:"sellers",modField:"isMailVerified",queField:"seller_id",id:data.data.id})
                .then(d=>{
                    if(d.changedRows>0){
                        console.log(result);
                        res.send("Email verified successfully. We are reviewing your application. We will contact you through this email please keep on checking our reply. Thank you.");
                    }
                })
            }).catch((err) => {
                console.log(err);
                res.status(500).send(err)
            });
        }
    })
}

function loadLoginPage(req,res){
    if(req.session.isLoggedIn && req.session.isSeller){
        res.redirect("/seller/dashboard");
        return
    }
    res.render("seller/login",{err:null,loggedin:false})
}

function loadSignUpPage(req,res){
    if(req.session.isLoggedIn && req.session.isSeller){
        res.redirect("/seller/dashboard");
        return
    }
    res.render("seller/signup",{err:null})
}

function loginSeller(req,res){
    console.log(req.path,req.body);
    findUser({table:"sellers",email:req.body.email})
    .then((result) => {
        if(result.length>0){
            if(result[0].password==req.body.password && result[0].role=="seller" && result[0].isApproved && result[0].isMailVerified){
                console.log(result[0]);
                setSession(req,result[0])
                res.redirect("/seller/dashboard");
            } else {
                res.render("seller/login",{err:"Either your application is not accepted yet or your mail isn't verified"});
            }
        } else {
            res.render("seller/login",{err:"Invalid Credentials",loggedin:false});
        }
    }).catch((err) => {
        console.log(err);
        res.send("Not found")
    });  
}

function logout(req,res){
    req.session.destroy()
    res.redirect("/seller/login");
}

function loadDashboard(req,res){
    if(req.session.isLoggedIn && req.session.isSeller){
        res.render("seller/dashboard",{username:req.session.name,userId:req.session.userId,loggedin:true})
        return
    }
    res.redirect("/seller/login");
}

function loadProducts(req,res){
    getSellerProducts({seller_id:req.session.userId,page:req.params.id})
    .then((result) => {
        console.log(result);
        if(result.length>0){
            console.log(result);
            res.json(result);
        } else {
            res.status(404).send("No Products found")
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error")
    });
}

function addNewProduct(req,res){

    if(!req.session.isSeller && !req.session.isLoggedIn){
        res.redirect("/seller/login")
        return
    }
    const product = {
        p_id:uuid(),
        name: req.body.name,
        description: req.body.desc,
        price: req.body.price,
        quantity: req.body.quantity,
        image: req.files[0].filename,
        seller_id: req.session.userId
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

function getNewOrders(req,res){
    console.log(req.session);
    getNewOrdersForSeller({sid:req.session.userId,sts:"waiting"})
    .then((result) => {
        if(result.length>0){
            res.render("seller/newOrders",{orders:result,username:req.session.name,userId:req.session.userId,loggedin:true})
        } else {
            res.render("seller/newOrders",{orders:null,username:req.session.name,userId:req.session.userId,loggedin:true})
        }
    }).catch((err) => {
        console.log(err);
        res.send(err)
    });
}

function getCancelledOrders(req,res){
    getNewOrdersForSeller({sid:req.session.userId,sts:"cancelled"})
    .then((result) => {
        if(result.length>0){
            res.render("seller/cancelledOrders",{orders:result,username:req.session.name,userId:req.session.userId,loggedin:true})
        } else {
            res.render("seller/cancelledOrders",{orders:null,username:req.session.name,userId:req.session.userId,loggedin:true})
        }
    }).catch((err) => {
        console.log(err);
        res.send(err)
    });
}

function getConfirmedOrders(req,res){
    getNewOrdersForSeller({sid:req.session.userId,sts:"confirmed"})
    .then((result) => {
        if(result.length>0){
            res.render("seller/confirmedOrders",{orders:result,username:req.session.name,userId:req.session.userId,loggedin:true})
        } else {
            res.render("seller/confirmedOrders",{orders:null,username:req.session.name,userId:req.session.userId,loggedin:true})
        }
    }).catch((err) => {
        console.log(err);
        res.send(err)
    });
}   

function getDispatchedOrders(req,res){
    getNewOrdersForSeller({sid:req.session.userId,sts:"dispatched"})
    .then((result) => {
        if(result.length>0){
            res.render("seller/dispatchedOrders",{orders:result,username:req.session.name,userId:req.session.userId,loggedin:true})
        } else {
            res.render("seller/dispatchedOrders",{orders:null,username:req.session.name,userId:req.session.userId,loggedin:true})
        }
    }).catch((err) => {
        console.log(err);
        res.send(err)
    });
}

function getSalesReport(req,res){

}

function acceptOrder(req,res){
    console.log(req.params.id);
    updateOrder({qry:`status="confirmed", delivery_date = "${new Date(new Date().getTime() + 120 * 60 * 60 * 1000).toISOString()}"`,oid:req.params.id})
    .then((result) => {
        if(result.changedRows>0){
            res.status(200).end()
        } else {
            res.status(404).end();
        }
    }).catch((err) => {
        res.status(500).send(err)
    });
}

function dispatchTo(req,res){
    updateOrder({qry:`status = "dispatched"`,oid:req.params.id})
    .then((result) => {
        if(result.changedRows>0){
            res.status(200).end();
        } else {
            res.status(404).end();
        }
    }).catch((err) => {
        res.status(500).send(err);
    });
}

function getNearbyCenter(req,res){
    getNearByCenter({city:req.session.city})
    .then((result) => {
        if(result.length>0){
            res.json(result);
        } else {
            res.json("[]");
        }
    }).catch((err) => {
        res.send(err);
    });
}

function setSession(req,user){
    req.session.isLoggedIn = true
    req.session.name = user.fName+" "+user.lName
    req.session.email = user.email
    req.session.userId = user.seller_id
    req.session.role = user.role
    req.session.city = user.city
    req.session.isSeller = (user.role=="seller")?true:false
}

module.exports = {
    loadProducts,
    verifyEmail,
    loadLoginPage,
    loginSeller,
    loadDashboard,
    logout,
    addNewProduct,
    editProduct,
    deleteProduct, 
    loadSignUpPage, 
    signUpSeller,
    getNewOrders,
    // placeOrder,
    getCancelledOrders,
    getConfirmedOrders,
    getDispatchedOrders,
    getSalesReport,
    acceptOrder,
    dispatchTo,
    getNearbyCenter
}