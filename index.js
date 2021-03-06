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

mongoose.connect(process.env.MONGO_URL);

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

var port = process.env.PORT || 8080;

app.listen(port);
console.log("listening on port " + process.env.PORT);