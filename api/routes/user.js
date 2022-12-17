const express = require('express');
const User = require('../models/user');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        fs.mkdir('./uploads/',(err)=>{
            cb(null, './uploads/');
         });
    },
    filename: function (req, file, cb) {
      cb(null,  file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })




// Sign up
router.post("/signup",upload.single('avatar'), (req,res,next) => {
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
                    password : hash,
                    avatar : req.file.path
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

// Login
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

//Get profile picture
router.get("/avatar/:id",checkAuth, (req,res,next)=> {
    const id = req.params.id;
    User.findById(id).exec().then(data => {
        res.status(200).json(data.avatar);
     }).catch(err => { 
        res.status(500).json({
            err : err
        });
     });
      
})

router.delete("/avatar/:id",checkAuth, (req,res,next)=> {
    const id = req.params.id;
    User.findById(id).exec().then(data => {
            try {
                fs.unlinkSync(data.avatar);
                const user = new User({
                    _id : id,
                    email : data.email,
                    password : data.password,
                    avatar : ''
                });
        
            User.findByIdAndUpdate(id , user).then(result => {
                res.status(201).json({
                    msg : 'Image  has been deleted',
                    User : user
                });
            }).catch(err => {
                res.status(500).json({
                    error : err
                });
            });
              } catch (err) {
                return res.status(400).send(err);
              }

     }).catch(err => { 
        res.status(500).json({
            err : err
        });
     });
        
      
})


module.exports = router;