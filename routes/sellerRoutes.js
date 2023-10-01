const express = require('express');
const sellerController = require('../contollers/sellerController');
const sellerRoutes = express();

sellerRoutes.route("/login")
.get(sellerController.loadLoginPage)
.post(sellerController.loginAdmin)

sellerRoutes.route("/signup")
.get(sellerController.loadSignUpPage)
.post(sellerController.signUpSeller)

sellerRoutes.get("/dashboard",sellerController.loadDashboard)
sellerRoutes.get("/logout",sellerController.logout)

sellerRoutes.route("/products")
.post(sellerController.addNewProduct)

sellerRoutes.route("/products/:id")
.patch(sellerController.editProduct)
.delete(sellerController.deleteProduct)

module.exports = sellerRoutes