var mongoose = require('mongoose');

mongoose.connect('mongodb://delpast:123456@localhost:27017/testmongo');

exports = module.exports = mongoose;