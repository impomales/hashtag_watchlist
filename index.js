var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.send('hello...');
});

app.listen(process.env.PORT);
console.log("listening on port " + process.env.PORT);