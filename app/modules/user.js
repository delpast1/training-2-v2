var User = require('../models/user'),
    validator = require('email-validator'),
    Event = require('../models/event')

var noop = function(){};
    
var login = (request, callback) => {
    let cb = callback || noop,
        req = request || {},
        id = req.id || '',
        password = req.password || '';
    User.findOne({id: id}, (err, user) => {
        if (err) {
            console.log(err);
            return cb('Connect failed!')
        } else {
            if(!user) {
                return cb('User does not exist.');
            } else if (user) {
                if (user.password != password){
                    return cb('Wrong password.');
                } else {
                    return cb(null, user);
                }
            }
        }
    });
};

var addUser = (request, callback) => {
    var workflow = new (require('events').EventEmitter)(),
        cb = callback || noop,
        req = request || {};
    workflow.on('validateParams', ()=>{
        var errors = [];
        console.log(req);
        if (!req.id){
            errors.push('Id required');
        }
        if (!req.password){
            errors.push('Password required');
        }
        workflow.emit('finishValidate', errors);
    });

    workflow.on('finishValidate', (errors)=>{
        console.log('finishValidate');
        if (errors.length){
            console.log('Error validation', errors);
            cb(errors);
        } else {
            workflow.emit('checkExist');
        }
    });

    workflow.on('checkExist', (errors) => {
        User.findOne({id: req.id}, (err, user) => {
            if (err){
                cb(err);
            } else {
                if (user) {
                    cb('Existed Account');
                } else {
                    workflow.emit('addUser');
                }
            }
        });
    });

    workflow.on('addUser', () => {
        var user = new User({
            id: req.id,
            password: req.password,
            admin: (req.admin === 'true')
        });

        user.save((err) => {
            if (err) {
                return cb(err);
            }
            return cb(null, {'message': 'Add successfully'});
        })
    });

    workflow.emit('validateParams');
};

var deleteUser = (request, callback) => {
    var cb = callback || noop,
        req = request || {};
    User.remove({_id: req.id}, (err) => {
        if (!err) {
                cb(null, {message: 'Delete successfully!'});
            } else {
                console.log(err);
                cb(null,{message: 'Error!'});
            }
        });
};

var listUser = (request, callback) => {
    var cb = callback || noop,
        req = request || {};
    
    User.find(req, (err,users) => {
        var response = users;
        if (err) {
            return cb(err);
        } else return cb(null, response);
    });
};

var addFriend = (request, callback) => {
    var cb = callback || noop,
        req = request || {};
    var UserID;
    User.findOne({id: req.id}, (err, user) => {
        user.friends.push({id: req.FriendID});
        UserID = user.id;
        user.save((err) => {
            if (err) {
                cb(err);
            } else {
                return cb(null, {message: 'Add successfully'});
            }
        });
    });

    User.findOne({id: req.FriendID}, (err, user2) => {
        user2.friends.push({id: UserID});
        user2.save((err) => {
            if (err) {
                cb(err);
            } else {
                return cb(null, {message: 'Add successfully'});
            }
        });
    });
};

var historyPurchase = (request, callback) => {
    //Dung event emitter
    var cb = callback || noop,
        req = request || {};

    User.findOne({id: req.id}, (err, user) => {
        var response = [];
        user.events.map((event) => {
            let friends = [];
            let ticketA = 0;
            let ticketB = 0;
            Event.findOne({_id: event.EventID}, (err,event) => {
                event.tickets.map((ticket) => {
                    if (ticket.buyer == user.id){
                        if (ticket.kind == 'A'){
                            ticketA++;
                        } else ticketB++;
                    };
                });

                for(let j=0; j<user.friends.length; j++){
                    for (let i=0;i<event.tickets.length; i++){
                        if (event.tickets[i].buyer == user.friends[j].id) {
                            friends.push({id: user.friends[j].id});
                            break;
                        }
                    };
                }
                
                let result = {
                    Event_Name: event.name,
                    Event_Desc: event.desc,
                    Event_Date: event.date,
                    Count_Of_TickeA: ticketA,
                    Count_Of_TickeB: ticketB,
                    Friends_Bought: friends 
                };
                response.push(result);
                //check o day xem khi nao thi no map den phan tu cuoi cung roi return cung dc
                if (user.events[user.events.length-1].EventID == event._id){
                    return cb(null,response);
                }
        });
            //phai tim cach return o day
        });
        //No ko cho o dau dau ku, no call cai nay ngay tuc khau, vi cai lenh sql kia la async
        
    });
    //return cb(null,response);
};

exports = module.exports = {
    login: login,
    addUser: addUser,
    listUser: listUser,
    addFriend: addFriend,
    historyPurchase: historyPurchase,
    deleteUser: deleteUser
}