'use strict';

var express = require('express');
var mongoose = require('mongoose');
var routes = require('./routes/routes');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
mongoose.Promise = require('bluebird');

var app = express();
require('dotenv').load();
require('./config/passport')(passport);

mongoose.connect('mongodb://' + process.env.IP + '/local');

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.listen(process.env.PORT);
console.log("listening on port " + process.env.PORT);