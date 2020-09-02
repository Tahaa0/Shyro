require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");
const path = require("path");
const url = require('url');

var EventEmitter = require('events').EventEmitter;
var EventController = new EventEmitter();

const crypto = require('crypto');
//Setting up SESSION

var session = require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
});



// Setting up port
const connUri = process.env.MONGO_LOCAL_CONN_URL;
let PORT = process.env.PORT || 3000;


//=== 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(session);

app.use(cors());

// for parsing application/json
app.use(express.json());

// for parsing application/xwww-
app.use(express.urlencoded({ extended: false }));
//form-urlencoded

// view engine setup

/*

app.set('view engine', 'jade');
*/

//app.use(/public',express.static(__dirname + '/public'));'
app.set('views', path.join(__dirname, 'views'));
app.use('/views', express.static(__dirname + '/views'));
//=== 2 - SET UP DATABASE
//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.connect(connUri, { useNewUrlParser: true , useCreateIndex: true});

const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB --  database connection established successfully!'));
connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

//=== 3 - INITIALIZE PASSPORT MIDDLEWARE
app.use(passport.initialize());
require("./middlewares/jwt")(passport);


//=== 4 - CONFIGURE ROUTES
//Configure Route
require('./routes/index')(app);


//=== 5 - START SERVER
var serv = app.listen(PORT, () => console.log('Server running on http://localhost:'+PORT+'/'));

var io = require('socket.io')(serv,{});		//SOCKET.IO Set-up

var sharedsession = require("express-socket.io-session");


//SESSION
io.use(sharedsession(session),{
    autoSave:true,
});

//SOCKET.IO

//Configure socket
require('./socket/index')(io);

//Configure GameManager