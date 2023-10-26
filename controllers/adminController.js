const Product = require('../models/products.js')
const User = require('../models/users.js')
const {v4:uuid} = require('uuid')
const {findUser, getAllSellerReq, updateUser, getUnApprovedProductsDb, updateProduct } = require('../utils/dbqueries.js');
const db = require('../models/db.js');
const sendMail = require('../utils/email.js')

function loadLoginPage(req,res){
    if(req.session.isLoggedIn && req.session.isAdmin){
        res.redirect("/admin/dashboard");
        return
    }
    res.render("admin/login",{err:null})
}

function loginAdmin(req,res){
    console.log(req.path,req.body);
    findUser({table:"ecom_users",email:req.body.email})
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

async function loadDashboard(req,res){
    const reqsts = await getAllSellerReq(`seller_id,fName, lName, buisnessName, city, pincode, profileImage`);
    if(req.session.isLoggedIn && req.session.isAdmin){
        res.render("admin/dashboard",{seller_requests:reqsts,username:req.session.name,userId:req.session.userId,loggedin:true})
        return
    }
    res.redirect("/admin/login");
}


function showSellerDetails(req,res){
    getAllSellerReq(`seller_id,
                    fName, 
                    lName, 
                    gender, 
                    email, 
                    mobile, 
                    dob, 
                    buisnessName, 
                    buisnessAddress, 
                    aadharNumber, 
                    panNumber, 
                    gstNumber, 
                    aadharPdf,
                    panPdf,
                    storeImage,
                    profileImage,
                    city,
                    pincode`)
    .then((result) => {
        res.render("admin/sellerDetails",{seller:result,username:req.session.name,userId:req.session.userId,loggedin:true})
    }).catch((err) => {
        res.send(err)
    });
}

function approveSeller(req,res){
    console.log(req.params.id);
    updateUser({table:"sellers", modField:"isApproved",queField:"seller_id",id:req.params.id})
    .then((result) => {
        console.log(result);
        if(result.changedRows>0){
            const msg = `<h2>Hello ${data.fName},</h2>
                <h2>Greetings from WOW BAZZAR,</h2>
                <p>Your application to join us as a seller has been Approved.
                <br><a href="127.0.0.1:8000/seller/login">Click here to login to your dashboard.</a>
                <br>Have a great day!</p>`;
                sendMail(data.email,data.fname,msg,"Seller Application Approved");
            res.status(200).end();
        } else{
            res.status(404).send("Not found")
        }
    }).catch((err) => {
        res.status(500).send(err);
    });
}

function rejectSeller(req,res){
    console.log(req.params.id);
    db.query(`select email, fName from sellers where seller_id="${req.params.id}"`,(err,data)=>{
        if(err){
            res.status(404).send(err);
            console.log(err);
        } else {
            console.log(data);
            db.query(`delete from sellers where seller_id="${req.params.id}"`,(err,result)=>{
                console.log(result);
                if(err){
                    res.status(404).send(err);
                } else {
                    if(result.affectedRows>0){   
                        const msg = `<h2>Hello ${data[0].fName},</h2>
                        <h2>Greetings from WOW BAZZAR,</h2>
                        <p>Your application to join us as a seller has been declined.
                        <br>Your application does not comply with our policies.</p>`;
                        sendMail(data[0].email,data[0].fname,msg,"Seller Application Declined");
                        res.status(200).end();
                    }
                }
            })
        }
    })
}

function getUnApprovedProducts(req,res){
    if(req.session.isLoggedIn && req.session.isAdmin){
        getUnApprovedProductsDb()
        .then((result) => {
            if(result.length>0){
                result.forEach(element => {
                    delete element.password
                });
                res.status(200).json(result);
            } else {
               res.status(400).end();
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Internal server error")
        });
    }
}

function getProductReqPage(req,res){
    if(req.session.isLoggedIn && req.session.isAdmin){
        res.render("admin/productReq",{username: req.session.username,loggedin: true, userId: req.session.userId});
    } else {
        res.redirect("/admin/login")
    }
}

function approveProduct(req,res){
    console.log(req.body.sts,req.params.id);
    if(req.session.isLoggedIn && req.session.isAdmin){
        db.query(`update products set isApproved = "${req.body.sts}" where p_id = "${req.params.id}"`,(err,data)=>{
            if(data.changedRows>0){
                res.status(200).end();
            } else if(err){
                res.status(500).send("Internal server error")
            } else {
                res.status(404).send("Not found")
            }
        })
    } else {
        res.redirect("/admin/login")
    }
}

function setSession(req,user){
    req.session.isLoggedIn = true
    req.session.name = user.name
    req.session.email = user.email
    req.session.userId = user.id
    req.session.role = user.role
    req.session.isAdmin = true
}

module.exports = {
    loadLoginPage,
    loginAdmin,
    loadDashboard,
    logout,
    showSellerDetails,
    approveSeller,
    rejectSeller,
    getUnApprovedProducts,
    approveProduct,
    getProductReqPage
}