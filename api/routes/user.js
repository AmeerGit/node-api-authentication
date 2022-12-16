const express = require('express');
const User = require('../models/user');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');

router.post("/signup", (req,res,next) => {
   
   User.find({ email : req.body.email }).exec().then(user => {
     if(user.length >= 1){
        return res.status(422).json({
            error : "Email already exist"
        });
     } else {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
            if(err){
                res.status(500).json({
                    error : err
                });
            } else {
                const user = new User({
                    _id : new mongoose.Types.ObjectId(),
                    email : req.body.email,
                    password : hash
                });
        
            user.save().then(result => {
                res.status(201).json({
                    msg : 'New user has been added',
                    User : user
                });
            }).catch(err => {
                res.status(500).json({
                    error : err
                });
            });
            }
        })
     }  
   });

});

router.post("/login", (req,res,next) => {
    User.find({ email : req.body.email }).exec().then(user => {
        if(user.length < 1){
           return res.status(422).json({
               error : "Auth failed 1" 
           });
    } else {
           bcrypt.compare(req.body.password , user[0].password , function(err, result) {
           if(err){
            return res.status(422).json({
                error : "Auth failed"
            });
           }
           if(result){
            const token = jwt.sign({ 
                email : user[0].email,
                password : user[0].password,
             }, 'secret' , {
                expiresIn : '2h'
             });
            return res.status(200).json({
                success : "Auth success",
                token : token
            });
           }
           return res.status(401).json({
            error : "Auth failed"
        });
        });
        
    }
});
});

module.exports = router;