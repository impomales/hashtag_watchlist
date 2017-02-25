'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var user = new mongoose.Schema({
    displayName: String,
    name: {
        firstName: String,
        middleName: String,
        lastName: String
    },
    watchlists: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Watchlist'}],
        validate: [max_array_length, '{PATH} exceeds array length of 3']
    }
});

// at most 3 watchlists per user.
function max_array_length(value) {
    return value.length <= 3;
}

module.exports = mongoose.model('User', user);