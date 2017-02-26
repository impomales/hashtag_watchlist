'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use(new TwitterStrategy({
        consumerKey: process.env.CONSUMER_KEY,
        consumerSecret: process.env.CONSUMER_SECRET,
        callbackURL: process.env.APP_URL + '/auth/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
        User.findOne({'_id': profile.displayName}, function(err, user) {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
                var newUser = {
                    _id: profile.displayName,
                    name: {
                        firstName: profile.givenName,
                        middleName: profile.middleName,
                        lastName: profile.familyName
                    },
                    watchlists: []
                };
                
                User.create(newUser, function(err, doc) {
                    if (err) throw err;
                    return done(null, doc);
                });
            }
        });
    }));
};