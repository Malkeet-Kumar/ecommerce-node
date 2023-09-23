const express = require('express');
const adminController = require('../contollers/adminController');
const adminRoutes = express();

adminRoutes.route("/login")
.get(adminController.loadLoginPage)
.post(adminController.loginAdmin)

adminRoutes.route("/")
.get(adminController.loadLoginPage)

adminRoutes.get("/dashboard",adminController.loadDashboard)
adminRoutes.get("/logout",adminController.logout)

adminRoutes.route("/products")
.post(adminController.addNewProduct)

adminRoutes.route("/products/:id")
.patch(adminController.editProduct)
.delete(adminController.deleteProduct)

module.exports = adminRoutes