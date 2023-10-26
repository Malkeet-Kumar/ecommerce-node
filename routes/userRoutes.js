const express = require('express');
const userController = require('../controllers/userController');
const userRoutes = express();

userRoutes.get("/",userController.loadHomePage)

userRoutes.route("/signup")
.get(userController.loadSignupPage)
.post(userController.createUser);

userRoutes.get("/verify/email/:token",userController.verifyEmail)

userRoutes.route("/login")
.get(userController.loadLoginPage)
.post(userController.loginUser)

userRoutes.get("/logout",userController.logoutUser)

userRoutes.route("/forgotpassword")
.get(userController.loadForgotPassword)
.post(userController.sendPasswordResetMail)

userRoutes.route("/forgotpassword/:token")
.get(userController.loadResetPage)
.patch(userController.resetpassword)

userRoutes.route("/changepassword")
.get(userController.loadPasswordPage)
.patch(userController.changepassword)

userRoutes.get("/home",userController.loadHomePage)

userRoutes.route("/cart/:item")
.post(userController.addToCart)
.patch(userController.editItemQuantity)
.delete(userController.removeFromCart)

userRoutes.route("/order")
.get(userController.getOrderPage)
.post(userController.placeOrder)

userRoutes.route("/myorders/:id")
.get(userController.getMyOrders)
.post(userController.cancelOrder)

userRoutes.get("/track/:id",userController.trackOrder)

userRoutes.get("/cart",userController.loadMyCartPage)

userRoutes.get("/mycart",userController.loadMyCart)

// userRoutes.route("/cart/:pid")
// .patch()

module.exports = userRoutes