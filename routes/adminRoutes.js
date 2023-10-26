const express = require('express');
const adminController = require('../controllers/adminController');
const adminRoutes = express();

adminRoutes.route("/login")
.get(adminController.loadLoginPage)
.post(adminController.loginAdmin)

adminRoutes.route("/")
.get(adminController.loadLoginPage)

adminRoutes.get("/dashboard",adminController.loadDashboard)
adminRoutes.route("/requests/:id")
.get(adminController.showSellerDetails)
.patch(adminController.approveSeller)
.delete(adminController.rejectSeller)

adminRoutes.get("/product/requests",adminController.getProductReqPage)
adminRoutes.route("/products/:id")
.get(adminController.getUnApprovedProducts)
.patch(adminController.approveProduct)

adminRoutes.get("/logout",adminController.logout)

module.exports = adminRoutes