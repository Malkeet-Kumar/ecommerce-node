const express = require('express');
const products = require('../contollers/products');
const productsRoutes = express();

productsRoutes.get("/products/:items",products.getProducts)

module.exports = productsRoutes