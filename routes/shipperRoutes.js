const express = require('express');
const shipperController = require('../controllers/shipperController');
const deliveryController = require('../controllers/deliveryController');
const shipperRoutes = express();

shipperRoutes.get("/",shipperController.loadHomePage)
shipperRoutes.route("/login")
.get(shipperController.loadLoginPage)
.post(shipperController.loginShipper)

shipperRoutes.get("/logout",shipperController.logoutShipper)

shipperRoutes.route("/shipments/:type")
.get(shipperController.loadShippments)

shipperRoutes.route("/shipments/:shipmentid")
.patch(shipperController.shipmentReceived)
.put(shipperController.dispatchToNextCenter)

/* Delivery Person */
shipperRoutes.route("/delivery/login")
.get(deliveryController.loadLoginPage)
.post(deliveryController.loginUser)

shipperRoutes.get("/delivery/logout",deliveryController.logoutUser)

shipperRoutes.get("/delivery/",deliveryController.loadHomePage) //dashboard

shipperRoutes.route("/delivery/delivering/:id")
.get(deliveryController.getAllDeliveries)
.patch(deliveryController.itemDelivered)

shipperRoutes.route("/delivery/delivered")
.get(deliveryController.getDelivered)



module.exports = shipperRoutes