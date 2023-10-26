const { findUser, getDeliveries, markItemDelivered} = require('../utils/dbqueries')
function loadHomePage(req,res){
    if(req.session.isLoggedIn && req.session.isDeliverer)
        res.render("delivery/home",{username:req.session.username, loggedin:true})
    else 
        res.redirect("/shipper/delivery/login")
}

function loadLoginPage(req,res){
    if(req.session.isLoggedIn && req.session.isDeliverer){
        res.redirect("/shipper/delivery",{username:req.session.username,loggedin:true})
    } else {
        res.render("delivery/login",{err:null,loggedin:false})
    }
}

function loginUser(req,res){
    if(req.session.isLoggedIn && req.session.isDeliverer){
        res.redirect("/shipper/delivery",{username:req.session.username,loggedin:true})
    } else {
        findUser({table:"deliverypersons",email:req.body.email})
        .then((result) => {
            if(result.length>0){
                if(result[0].password==req.body.password){
                    setSession(req,result[0])
                    res.redirect("/shipper/delivery/")
                } else {
                    res.render("delivery/login",{err: "Incorrect password !",loggedin:false})   
                }
            } else {
                res.render("delivery/login",{err:"user not found !",loggedin:false})
            }
        }).catch((err) => {
            res.status(500).send("Internal server error occured : "+err)
        });
    }
}

function logoutUser(req,res){
    req.session.destroy()
    res.redirect("/shipper/delivery/login")
}

function getAllDeliveries(req,res){
    if(req.session.isLoggedIn && req.session.isDeliverer){
        getDeliveries({id:req.session.userId,status:"dispatched"})
        .then((result) => {
                res.json(result)
        }).catch((err) => {
            res.status(500).send("Ineternal server error : ",err)
        });
    } else {
        res.status(403).json({err: "Unauthorised access", msg: "You are unathorised to access this api"})
    }
}

function getDelivered(req,res){
    if(req.session.isLoggedIn && req.session.isDeliverer){
        getDeliveries({id:req.session.userId,status:"delivered"})
        .then((result) => {
                res.json(result)
        }).catch((err) => {
            res.status(500).send("Ineternal server error : "+err)
        });
    } else {
        res.status(403).json({err: "Unauthorised access", msg: "You are unathorised to access this api"})
    }
}

function itemDelivered(req,res){
    if(req.session.isLoggedIn && req.session.isDeliverer){
        markItemDelivered({oid:req.params.id, id:req.session.userId})
        .then((result) => {
            console.log(result);
            if(result.changedRows>0){
                res.status(200).end()
            } else {
                res.status(404)
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Internal server error : "+err)
        });
    } else {
        res.redirect("/shipper/delivery/login")
    }
}

function setSession(req,user){
    req.session.isLoggedIn = true
    req.session.isDeliverer = true
    req.session.userId = user.delp_id
    req.session.username = user.name
}

module.exports = {loadHomePage,loadLoginPage,loginUser,logoutUser,getAllDeliveries,itemDelivered,getDelivered}