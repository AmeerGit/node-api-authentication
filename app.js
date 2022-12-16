const express = require('express');
const app = express();
const taskRouters = require('./api/routes/tasks');
const userRouters = require('./api/routes/user');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect('mongodb+srv://admin:admin1989@cluster0.52ozvjb.mongodb.net/?retryWrites=true&w=majority');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/tasks", taskRouters );
app.use("/users", userRouters );
module.exports = app;
