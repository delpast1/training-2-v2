var mongoose = require('../db');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    id: String,
    password: String,
    admin: Boolean,
    friends: [{
        id: String
    }],
    events: [{
        EventID: String
    }]
}));