const express = require('express');
const Task = require('../models/task');
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');

router.get("/", checkAuth, (req,res,next) => {
     Task.find().exec().then(data => {
        res.status(200).json(data);
     }).catch(err => { 
        res.status(500).json({
            err : err
        });
     });

   
});

router.post("/", (req,res,next) => {
    const task = new Task({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name
    });

    task.save().then(result => {
       console.log(result)
    }).catch(err => console.log(err));
    
    res.status(201).json({
        msg : 'New task has been added',
        Task : task
    });
   
});

router.get('/:id', (req,res,next)=> {
    const id = req.params.id;
    Task.findById(id).exec().then(data => {
        res.status(200).json(data);
     }).catch(err => { 
        res.status(500).json({
            err : err
        });
     });
});

module.exports = router;