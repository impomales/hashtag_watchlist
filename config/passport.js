'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
    passport.use(new TwitterStrategy({
        consumerKey: process.env.CONSUMER_KEY,
        consomerSecret: process.env.CONSUMER_SECRET,
        callbackURL: process.env.APP_URL + '/auth/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
        var user = {
            _id: profile.displayName,
            name: {
                firstName: profile.givenName,
                middleName: profile.middleName,
                lastName: profile.familyName
            },
            watchlists: []
        };
        
        User.findOrCreate(user, function(err, user) {
            if (err) {return done(err);}
            done(null, user);
        });
    }));
};