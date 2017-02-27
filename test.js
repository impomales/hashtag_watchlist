'use strict';

var assert = require('assert');
var express = require('express');
var mongoose = require('mongoose');
var routes = require('./routes/routes');
var bodyParser = require('body-parser');
var superagent = require('superagent');
var passport = require('passport');
var session = require('express-session');
var Watchlist = require('./models/watchlist');
var User = require('./models/user');
var URL_ROOT =  'http://' + process.env.IP + ':' + process.env.PORT;
var server;

describe('Test App', function() {
    before(function() {
        var app = express();
        require('dotenv').load();
        require('./config/passport')(passport);
        mongoose.Promise = require('bluebird');
        mongoose.connect('mongodb://' + process.env.IP + '/test');
        
        app.use(bodyParser.json());
        
        app.use(session({
            secret: 'testSESSION',
            resave: false,
            saveUninitialized: true
        }));
        
        app.use(passport.initialize());
        app.use(passport.session());
        routes(app, passport);
        
        server = app.listen(process.env.PORT);
    });
    
    after(function() {
        server.close();
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
                _id: 'impomales',
                name: 'Isaias M. Pomales',
                watchlists: []
            };
            
            it('can create and save a valid user document', function(done) {
                User.create(user, function(err, data) {
                    assert.ifError(err);
                    User.findById(data._id, function(err, res) {
                        assert.ifError(err);
                        assert.equal(res._id, 'impomales');
                        assert.equal(res.name, 'Isaias M. Pomales');
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
        var users = [{
            _id: 'impomales',
            name: 'Isaias M. Pomales',
            watchlists: []
        }];
        var watchlists = [
            {hashtag_title: '#cats'},
            {hashtag_title: '#dogs'},
            {hashtag_title: '#birds'}
        ];
        
        beforeEach(function(done) {
            User.remove({}, function(err) {
                assert.ifError(err);
                Watchlist.remove({}, function(err) {
                    assert.ifError(err);
                    User.create(users, function(err) {
                        assert.ifError(err);
                        Watchlist.create(watchlists, function(err) {
                            assert.ifError(err);
                            done();
                        });
                    });
                });
            });
        });
        
        it('can load all watchlists', function(done) {
            superagent.get(URL_ROOT + '/api/watchlists', function(err, res) {
                assert.ifError(err);
                assert.doesNotThrow(function() {
                    JSON.parse(res.text);
                });
                done();
            });
        });
        
        it('can add a new watchlist', function(done) {
            var newWatchlist = {
                hashtag_title: '#fishes'
            };
            superagent
                .post(URL_ROOT + '/api/watchlists')
                .set('Content-Type', 'application/json')
                .send(newWatchlist)
                .end(function(err, res) {
                    assert.ifError(err);
                    var result;
                    assert.doesNotThrow(function() {
                        result = JSON.parse(res.text);
                    });
                    assert.equal(result.hashtag_title, '#fishes');
                    assert.equal(result.settings.number_of_tweets, 5);
                    done();
                });
        });
        
        // add tests for editing and deleting watchlists.
    });
});