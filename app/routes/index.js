'use strict';

//var processor = require('../processor')();

var jwt = require('jsonwebtoken');

const secretKey = require('../config').secret;

var requireSession = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.json({
                    result: null,
                    error: 'Invalid token'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.json({
            result: null,
            error: 'Authorization required'
        });
    }
};

exports = module.exports = (app, controllers) => {
    app.get('/', (req,res) => {
        res.send('I just made a cool thing');
    });
    require('./user')(requireSession, app, controllers);
    require('./event')(requireSession, app, controllers);
    //cai nay tuong duong voi em copy nguyen cai file kia vao
    //tuong duong voi dat cai dong kia vao day, co ma e ko truyen vao 
    //thi may cai phia sau no null het
}
