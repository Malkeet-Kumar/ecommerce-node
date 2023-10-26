const express = require('express');
const products = require('../controllers/products');
const productsRoutes = express();

productsRoutes.get("/products/:items/:count",products.getProducts)
productsRoutes.get("/totalItems",products.getCount)

module.exports = productsRoutes