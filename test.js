'use strict';

var assert = require('assert');
var mongoose = require('mongoose');
var Watchlist = require('./models/watchlist');

describe('Test App', function() {
    before(function() {
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
    });
});