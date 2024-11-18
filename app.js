const express=require('express')
const app=express()
const fs=require("fs")
const path=require("path")
const multer=require("multer")
const expresslayouts=require('express-ejs-layouts')
const mongoose=require('mongoose')
const session=require('express-session')
const Post = require('./models/post')
const mongourl="mongodb+srv://<change-username-here>:<change-password-here>@<change-clustername-here>.mongodb.net/?retryWrites=true&w=majority&appName=<clustername>"
const storage=multer.memoryStorage();
const upload=multer({storage:storage});
mongoose.connect(mongourl)
mongoose.connection.once("open",()=>console.log("MongoDB is connected."))
app.use(expresslayouts)
app.set('view engine','ejs')
app.use(express.urlencoded({
    extended:false
}))
app.use(session({
    secret:"any",
    resave:false,
    saveUninitialized:false
}))
app.use('/users',require('./routes/users'))
app.get("/",async (req,res)=>{
    if (typeof req.session.email != "undefined"){
        try{
            const posts=await Post.find();
            res.render("index",{user: req.session.name,posts})
        } catch(err){
            console.error(err);
            res.status(500).send("Server error")
        }
        }else{
        res.render("login")
    }
})
app.get("/posting",(req,res)=>{res.render("upload")})
app.post("/posting",upload.single("image"),async(req,res)=>{
    const {title, description}=req.body;
    if(!title||!req.file){
        return res.status(400).send("Title and image are required.")
    }
    try{
        const newPost=new Post({
            title,description:description,image:req.file.buffer, contentType: req.file.mimetype,
        });
        await newPost.save();
        res.redirect("/")
    }catch(err){
        console.error(err);
        res.status(500).send("Server error")
    }
})
const port= <port-number>
app.listen(port, console.log(`Listening to port: ${port}`))
