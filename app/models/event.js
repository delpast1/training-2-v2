var mongoose = require('../db');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Event', new Schema({
    name: String,
    desc: String,
    date: Date,
    tickets: [{
        kind: String,
        buyer: String
    }]
}));