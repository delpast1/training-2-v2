//var processor = require('../processor')();
var mUser = require('../modules/index').user;
var jwt = require('jsonwebtoken');
var config = require('../config');

const secretKey = config.secret;

var login = (req,res) => {
    var request = {
        id: req.body.id,
        password: req.body.password
    };
    mUser.login(request, (err,response) => {
        var token = '',
            status = {},
            data = {};
        if (!err && response) {
            // req.session.user = response;
            console.log(
                'response: ', response
            );
            var signReponse = {
                id: response.id,
                admin: response.admin
            }
            token = jwt.sign(signReponse, secretKey, {
                expiresIn: 60*60
            });
            
            status = {
                'code': '1'
            }
            data = response;
        } else {
            status = {
                'code': '0',
                'message': err
            }
        }

        res.json({
            body: data,
            token: token,
            status: status
        });
    });
};

var addUser = (req, res) => {
    var request = {
        id: req.body.id,
        password: req.body.password
    };
    mUser.addUser(request, (err, response) => {
        res.json({ 
            result: response && !err ? response : null,
            error: err ? err : null
        });
    });
};

var deleteUser = (req,res) => {
    if (req.decoded.admin){
        var request = req.body;
        mUser.deleteUser(request , (err,response)=>{
            res.json({ 
                result: response && !err ? response : null,
                error: err ? err : null
            });
        });
    } else res.json({message: 'You are not admin'});
};  

var listUser = (req, res) => {
    if (req.decoded.admin){
        mUser.listUser({}, (err, response) => {
            res.json({
                result: response && !err ? response : null,
                error: err ? err : null
            });
        });
    }
}

var addFriend = (req, res) => {
    if (!req.decoded.admin){
        var request = {
            id: req.decoded.id,
            FriendID: req.body.FriendID
        };
        mUser.addFriend(request , (err,response)=>{
            res.json({ 
                result: response && !err ? response : null,
                error: err ? err : null
            });
        });
    } else res.json({message: 'Admin cannot add friend'});
};

var historyPurchase = (req, res) => {
    if (!req.decoded.admin){
        var request = {
            id: req.decoded.id
        };
        mUser.historyPurchase(request , (err,response)=>{
            console.log("REsponse: ", response);
            res.json({ 
                result: response && !err ? response : null,
                error: err ? err : null
            });
        });
    } else res.json({message: 'Admin cannot purchase ticket'});
};
exports = module.exports = {
    login: login,
    addUser: addUser,
    listUser: listUser,
    addFriend: addFriend,
    historyPurchase: historyPurchase,
    deleteUser: deleteUser
}
