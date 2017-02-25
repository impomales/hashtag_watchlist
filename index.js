'use strict';

var express = require('express');
var mongoose = require('mongoose');
var routes = require('./routes/routes');
var bodyParser = require('body-parser');
mongoose.Promise = require('bluebird');

var app = express();
mongoose.connect('mongodb://' + process.env.IP + '/local');

app.use(bodyParser.json());
routes(app);

app.listen(process.env.PORT);
console.log("listening on port " + process.env.PORT);