'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var watchlist = new mongoose.Schema({
    hashtag_title: {type: String, required: true, match: /^#\w+/i},
    watched_by: {type: String, ref: 'User'},
    settings: {
        number_of_tweets: {type: Number, default: 5},
        safe_filter: {type: Boolean, default: false},
        // 1 positive, -1 negative, 0 both.
        attitude: {type: Number, default: 0}
    }
});

module.exports = mongoose.model('Watchlist', watchlist);