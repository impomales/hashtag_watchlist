'use strict';

var assert = require('assert');
var mongoose = require('mongoose');
var Watchlist = require('./models/watchlist');
var User = require('./models/user');

describe('Test App', function() {
    before(function() {
        mongoose.Promise = require('bluebird');
        mongoose.connect('mongodb://' + process.env.IP + '/test');
    });
    
    describe('Mongoose Models', function() {
        
        describe('Watchlist', function() {
            
            before(function(done) {
                Watchlist.remove({}, function(err) {
                    assert.ifError(err);
                    done();
                });
            });
            
            var watchlist = {
                hashtag_title: '#cats'
            };
            
            it('can create and save a valid watchlist document', function(done) {
                Watchlist.create(watchlist, function(err, data) {
                    assert.ifError(err);
                    Watchlist.findById(data._id, function(err, res) {
                        assert.ifError(err);
                        assert.equal(res.hashtag_title, '#cats');
                        assert.equal(res.settings.number_of_tweets, 5);
                        assert.equal(res.settings.safe_filter, false);
                        assert.equal(res.settings.attitude, 0);
                        done();
                    });
                });
            });
        });
        
        describe('User', function() {
            
            before(function(done) {
                User.remove({}, function(err) {
                    assert.ifError(err);
                    done();
                });
            });
            
            var user = {
                displayName: 'impomales',
                name: {
                    firstName: 'Isaias',
                    middleName: 'Miguel',
                    lastName: 'Pomales'
                },
                watchlists: []
            };
            
            it('can create and save a valid user document', function(done) {
                User.create(user, function(err, data) {
                    assert.ifError(err);
                    User.findById(data._id, function(err, res) {
                        assert.ifError(err);
                        assert.equal(res.displayName, 'impomales');
                        assert.equal(res.name.firstName, 'Isaias');
                        assert.equal(res.name.middleName, 'Miguel');
                        assert.equal(res.name.lastName, 'Pomales');
                        assert.equal(res.watchlists.length, 0);
                        done();
                    });
                });
            });
            
            it('does not allow watchlists array greater than three', function(done) {
                User.findOne({}, function(err, data) {
                    assert.ifError(err);
                    data.watchlists.length = 4;
                    data.save(function() {
                        assert.ifError(0);
                        done();
                    });
                });
            });
        });
    });
    
    describe('API', function() {
        it('can do nothing', function() {
            
        });
    });
});