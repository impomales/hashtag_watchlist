'use strict';

var path = process.cwd();
var Watchlist = require('../models/watchlist');
var User = require('../models/user');

module.exports = function(app, passport) {
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }
    
    app.route('/login')
        .get(function(req, res) {
            res.sendFile(path + '/public/login.html');
        });
        
    app.route('/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/login');
        });
    
    app.route('/')
        .get(isLoggedIn, function(req, res) {
            res.sendFile(path + '/public/index.html');
        });
    
    // twitter authentication.
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/',
            failuteRedirect: '/login'
        }));
        
    // get currently logged in user info.
    app.route('/api/currentUser')
        .get(isLoggedIn, function(req, res) {
            User.findOne({_id: req.user._id}, function(err, doc) {
                if (err) throw new Error('error getting current user.');
                res.json(doc);
            });
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
            // check length of user watchlist array before adding another.
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
        .get(isLoggedIn, function(req, res) {
            Watchlist.find({watched_by: req.user._id}, function(err, result) {
                if (err) throw new Error('failed to get watchlists by ' + req.user._id);
                res.json(result);
            });
        });
        
    app.route('/api/edit')
        .put(isLoggedIn, function(req, res) {
            var update = req.body;
            // need to check that user._id == watched_by
            Watchlist.findByIdAndUpdate(update._id, update, function(err, result) {
                if (err) throw new Error('failed to edit watchlist with id: ' + update._id);
                res.json(result);
            });
        });
        
    app.route('/api/delete')
        .delete(isLoggedIn, function(req, res) {
            var deleted = req.body;
            // need to check that user._id == watched_by
            Watchlist.remove({_id: deleted._id}, function(err, result) {
                if (err) throw new Error('failed to delete watchlist with id: ' + deleted._id);
                res.json(result);
            });
        });
};