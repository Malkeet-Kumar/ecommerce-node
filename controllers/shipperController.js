const { getShipments, updateShipmentDb, getDeliveryPersons, findUser } = require("../utils/dbqueries");

function loadLoginPage(req,res){
    if(req.session.isShipper && req.session.isLoggedIn){
        res.redirect("/shipper/")
    } else {
        res.render("shipper/login", { err: null, loggedin: false, userId: null, username:null });
    }
}

function loginShipper(req,res){
    findUser({table:"shippers",email:req.body.email})
    .then((result) => {
        console.log(result);
        if(result.length>0){
            console.log(req.body.password);
            if(result[0].password == req.body.password){
                setSession(req,result[0])
                res.redirect("/shipper/")
            } else {
                res.render("shipper/login", { err: "Invalid Password", loggedin: false, userId: null, username:null });
            }
        } else {
            res.render("shipper/login", { err: "Email not Exists", loggedin: false, userId: null, username:null });
        }
    }).catch((err) => {
        console.log(err);
        res.render("shipper/login", { err: "Server Error Occured", loggedin: false, userId: null, username:null });
    });
}

function logoutShipper(req,res){
    req.session.destroy()
    res.redirect("/shipper/")
}

function loadHomePage(req, res) {
    if (req.session.isLoggedIn && req.session.isShipper) {
        res.render("shipper/home", { loggedin: true, shipments:null , username: req.session.username});
    } else {
        res.redirect("/shipper/login")  
    }
}

function loadShippments(req, res) {
    if(!req.session.isLoggedIn && !req.session.isShipper){
        res.redirect("/shipper/login")
        return
    }
    if(req.params.type=="onboarding"){
        getShipments({ id: req.session.userId, sts: "new" })
        .then((result) => {
            console.log(result);
            if (result.length > 0) {
                res.render("shipper/home", { loggedin: true, username: req.session.username, shipments: result, page:"incoming" });
            } else {
                res.render("shipper/home", { loggedin: true, username: req.session.username, shipments: null, page:"incoming" });
            }
        }).catch((err) => {
            console.log(err);
        });
    } else if(req.params.type=="assigndelivery"){
        getShipments({ id: req.session.userId, sts:"deliver" })
        .then((result) => {
            console.log(result);
            if (result.length > 0) {
                getDeliveryPersons({city:req.session.city})
                .then((r) => {
                    console.log(r);
                    if(r.length>0){
                        res.render("shipper/home", { loggedin: true, username: req.session.username, shipments: result, page:"deliver", delps: r });
                    }
                })
            } else {
                res.render("shipper/home", { loggedin: true, username: req.session.username, shipments: null, page:"deliver" });
            }
        }).catch((err) => {
            console.log(err);
        });
    } else if(req.params.type=="dispatchToNext"){
        getShipments({ id: req.session.userId, sts:"dispatchNext" })
        .then((result) => {
            console.log(result);
            if (result.length > 0) {
                res.render("shipper/home", { loggedin: true, username: req.session.username, shipments: result, page:"dispatchToNext" });
            } else {
                res.render("shipper/home", { loggedin: true, username: req.session.username, shipments: null, page:"dispatchToNext" });
            }
        }).catch((err) => {
            console.log(err);
        });
    } else if(req.params.type == "outForDelivery"){
        getShipments({id: req.session.userId, sts: "delivering"})
        .then((result) => {
            console.log(result);
            if (result.length > 0) {
                res.render("shipper/home", { loggedin: true, username: req.session.username, shipments: result, page:"delivering" });
            } else {
                res.render("shipper/home", { loggedin: true, username: req.session.username, shipments: null, page:"delivering" });
            }
        }).catch((err) => {
            console.log(err);
        });
    } else if(req.params.type == "dispatchedToNext"){
        getShipments({id: req.session.userId, sts: "dispatchedToNext"})
        .then((result) => {
            console.log(result);
            if (result.length > 0) {
                res.render("shipper/home", { loggedin: true, username: req.session.username, shipments: result, page:"dispatched" });
            } else {
                res.render("shipper/home", { loggedin: true, username: req.session.username, shipments: null, page:"dispatched" });
            }
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.render("shipper/home", { loggedin: true, username: req.session.username, shipments: null, page:null });
    }
}

function shipmentReceived(req,res){
    shipment_id = req.params.shipmentid;
    updateShipmentDb({qry:`${req.body.col} = "${new Date().toISOString()}"`,oid:shipment_id})
    .then((result) => {
        if(result.changedRows>0){
            res.status(200).send("Product received")
        } else {
            res.status(404).end()
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error");
    });
}

function dispatchToNextCenter(req, res) {
    shipment_id = req.params.shipmentid;
    updateShipmentDb({qry:`${req.body.col} = ${req.body.shipper_id}`,oid:shipment_id})
    .then((result) => {
        if(result.changedRows>0){
            res.status(200).send("Product received")
        } else {
            res.status(404).end()
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error");
    });
}

function setSession(req, user) {
    req.session.username = user.name
    req.session.userId = user.shipper_id
    req.session.isShipper = true
    req.session.isLoggedIn = true
    req.session.city = user.city
    req.session.pincode = user.pincode
}

module.exports = {
    loadHomePage,
    loadShippments,
    dispatchToNextCenter,
    shipmentReceived,
    loadLoginPage,
    loginShipper,
    logoutShipper
}