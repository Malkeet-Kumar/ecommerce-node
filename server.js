require('dotenv').config()
const express = require('express')
const session = require('express-session')
const {signUpUser} = require('./utils/dbqueries')
const db = require("./models/db")
const multer = require('multer')
const app = express()

app.set('view engine', 'ejs');
app.use("/",(req,res,next)=>{
    console.log(req.path,req.method);
    next();
})

const storage = multer.diskStorage(({
    destination: (req, file, cb)=>{ 
        if(file.fieldname=="storeImage"){
            cb(null,__dirname+"/public/uploads/storeImages")
        } else if(file.fieldname=="profileImage"){
            cb(null,__dirname+"/public/uploads/profileImages")
        } else if(file.fieldname=="aadharFile"){
            cb(null,__dirname+"/public/uploads/aadharCard")
        } else if(file.fieldname=="panFile"){
            cb(null,__dirname+"/public/uploads/panCard")
        } else {
            cb(null,__dirname+"/public/uploads/productImages")
        }
    },
    filename: (req, file, cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
}))

const upload = multer({storage:storage});
app.use(upload.any());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(express.static(__dirname+"/public"))
app.use(express.static(__dirname+"/public/uploads/productImages"))

const UserRoutes = require("./routes/userRoutes")
const AdminRoutes  =require("./routes/adminRoutes")
const sellerRoutes = require('./routes/sellerRoutes')
const ProductRoutes = require("./routes/productRoutes")

app.use("/",UserRoutes)
app.use("/admin",AdminRoutes)
app.use("/seller",sellerRoutes)
app.use("/p",ProductRoutes)

db.connect(err=>{
    if(err){
        console.log("Error can not connect to database ! ",err);
        return
    }
    console.log("Connected to database ");
    app.listen(process.env.PORT,()=>{
    console.log("Server is running on port 8000");
    })
})




