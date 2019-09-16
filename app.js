const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Database Connection
mongoose.connect(config.database);

// Make sure connection to database is established
mongoose.connection.on('connected',()=>{
    console.log('Database connection is established');
});

// On Connection Error
mongoose.connection.on('error',(error)=>{
    console.log(err);
});

const app = express();

// Users Router
const users = require('./routes/users');

// Port Number
const PORT = 3000;

// Set Static Folder to communicate with Front-End templates
app.use(express.static(path.join(__dirname,'public')));

// CORS Middleware to connect with Front-End port
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware to authenticate
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Users Routes
app.use('/users',users);

// Index Route
app.get('/',(req,res)=>{
    res.send("Invalid Endpoint"); 
});

// Start Server
app.listen(PORT, ()=>{
    console.log("Server started on port: " + PORT);
});