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
        })
        .post(function(req, res) {
            var watchlist = req.body;
            
            Watchlist.create(watchlist, function(err, doc) {
                if (err) throw new Error('failed to add new watchlist');
                res.json(doc);
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
        
    // get watchlists by user.
    app.route('/api/user/watchlists')
        .get(function(req, res) {
            // currently set as impomales since authentication not set up yet.
            Watchlist.find({watched_by: 'impomales'}, function(err, result) {
                if (err) throw new Error('failed to get watchlists by ' + req.user._id);
                res.json(result);
            });
        });
        
    app.route('/api/edit')
        .put(function(req, res) {
            var update = req.body;
            
            Watchlist.findByIdAndUpdate(update._id, update, function(err, result) {
                if (err) throw new Error('failed to edit watchlist with id: ' + update._id);
                res.json(result);
            });
        });
        
    app.route('/api/delete')
        .delete(function(req, res) {
            var deleted = req.body;
            
            Watchlist.remove({_id: deleted._id}, function(err, result) {
                if (err) throw new Error('failed to delete watchlist with id: ' + deleted._id);
                res.json(result);
            });
        });
};