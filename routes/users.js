const express=require('express')
const { default: mongoose } = require('mongoose')
const router=express.Router()
const bcrypt=require('bcrypt')
const User=require("../models/user")
const Post=require("../models/post")
router.get('/login',(req,res)=>res.render('login'))
router.get('/register',(req,res)=>res.render('register'))
router.post('/register', async(req,res) => {
    const {name,email,password,password2}=req.body;
    let errors = [];
    if (!name||!email||!password||!password2){
        errors.push({msg:"Please fill all fields"});
    }
    if (password.length<8){
        errors.push({ msg:"Password must be at least 8 characters"});
    }
    if (password!==password2){
        errors.push({msg:"Passwords do not match"});
        console.log("Passwords do not match.");
    }
    if (errors.length>0){
        return res.render("register");
    }
    try{
        const user = await User.findOne({email:email});
        if (user) {
            errors.push({msg: "Email is already registered"});
            return res.render("register");
        }
        const hashedpassword=await bcrypt.hash(password,10)
        const newUser = new User({
            name: name,
            email: email,
            password: hashedpassword
        });
        await newUser.save();
        res.render("login",{message:"This account is already registered. Please log in."});
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
});
router.post('/login', async (req,res) => {

    const {email,password} = req.body;
    try {
        const user = await User.findOne({email:email});
        if (!user) {
            return res.render("login", {message: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", {message: "Incorrect email or password"});
        }
        req.session.email = email;
        req.session.name = user.name;
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports=router
