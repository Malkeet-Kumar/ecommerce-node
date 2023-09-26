require('dotenv').config()
const express = require('express')
const session = require('express-session')
const db = require("./models/db")
// const p = require("./contollers/products")
// const ex = require("./mongoexample")
const multer = require('multer')
const upload = multer({dest :__dirname+"/public/uploads"});
const app = express()

app.set('view engine', 'ejs');
app.use(upload.single('product_image'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(express.static(__dirname+"/public"))

const UserRoutes = require("./routes/userRoutes")
const AdminRoutes  =require("./routes/adminRoutes")
const ProductRoutes = require("./routes/productRoutes")

app.use("/",UserRoutes)
app.use("/admin",AdminRoutes)
app.use("/p",ProductRoutes)

db.connect(err=>{
    if(err){
        console.log("Error can not connect to database ! ",err);
    }
    console.log("Connected to database ");
    app.listen(process.env.PORT,()=>{
    console.log("Server is running on port 8000");
    })
})




