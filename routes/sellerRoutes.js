const express = require('express');
const sellerController = require('../contollers/sellerController');
const sellerRoutes = express();

sellerRoutes.route("/login")
.get(sellerController.loadLoginPage)
.post(sellerController.loginSeller)

sellerRoutes.get("/logout",sellerController.logout)

sellerRoutes.route("/signup")
.get(sellerController.loadSignUpPage)
.post(sellerController.signUpSeller)

sellerRoutes.get("/verify/email/:token",sellerController.verifyEmail)

sellerRoutes.get("/dashboard",sellerController.loadDashboard)

sellerRoutes.route("/orders/new/:id")
.get(sellerController.getNewOrders)
.post(sellerController.acceptOrder)

sellerRoutes.route("/shipTo/:id")
.get(sellerController.getNearbyCenter)
.patch(sellerController.dispatchTo)

sellerRoutes.route("/orders/cancelled/:id")
.get(sellerController.getCancelledOrders)

sellerRoutes.route("/orders/accepted/:id")
.get(sellerController.getConfirmedOrders)

sellerRoutes.route("/orders/dispatched/:id")
.get(sellerController.getDispatchedOrders)

sellerRoutes.route("/sales/report")
.get(sellerController.getSalesReport)

sellerRoutes.route("/products")
.post(sellerController.addNewProduct)

sellerRoutes.route("/products/:id")
.get(sellerController.loadProducts)
.patch(sellerController.editProduct)
.delete(sellerController.deleteProduct)

module.exports = sellerRoutes