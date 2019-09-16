const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Register
router.post('/register',(req,res,next)=>{
    let newUser = new User({
        name:req.body.name,
        email:req.body.email,
        username:req.body.username,
        password: req.body.password
    });
    User.addUser(newUser,(err,user)=>{
        if(err){
            res.json({success:false,msg:"Failed to register user"});
        }else{
            res.json({success:true,msg:"User registered"});
        }
    });
});

// Authenticate
router.post('/authenticate',(req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username,(err,user)=>{
        if (err){
            throw err;
        }else if (!user){
            return res.json({success:false,msg:"User not found"});
        }else{
            User.comparePassword(user.password,password,(err,success)=>{
                if (err) throw err;
                if (success){
                    const token = jwt.sign(user.toJSON(),config.secret,{
                        expiresIn:604800, // 1 week to relogin
                    });
                    res.json({
                        success:success,
                        token:'JWT '     + token,
                        user:{
                            id:user._id,
                            name : user.name,
                            email:user.email,
                            username:user.username
                        }
                    });
                }else{
                    res.json({success:false,msg:"Wrong password"});
                }
            });
        }
    });
});

// Profile protected under JWT token
router.get('/profile', passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    res.json({
        user:req.user
    });
});

module.exports = router;