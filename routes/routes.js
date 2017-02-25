'use strict';

var Watchlist = require('../models/watchlist');
var User = require('../models/user');

module.exports = function(app) {
    app.route('/')
        .get(function(req, res) {
            res.json({text: 'hello...'});
        });
    
    // all watchlists.
    app.route('/api/watchlists')
        .get(function(req, res) {
            Watchlist.find({}, function(err, result) {
                if (err) throw new Error('failed to get all watchlists');
                res.json(result);
            });
        });
        
    // get watchlist by id.
    app.route('/api/watchlists/:id')
        .get(function(req, res) {
            Watchlist.findOne({_id: req.params.id}, function(err, result) {
                if (err) throw new Error('failed to get watchlist with id: ' + req.params.id);
                res.json(result);
            });
        });
};