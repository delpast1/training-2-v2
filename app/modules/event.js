var Event = require('../models/event');
var User = require('../models/user');

var noop = function(){};

var listEvents = (request, callback) => {
    var cb = callback || noop,
        req = request || {};
    
    Event.find(req, (err,events) => {
        var response = events;
        cb(err, response);
    });
};

var addEvent = (request, callback) => {
    var workflow = new (require('events').EventEmitter)(),
        cb = callback || noop,
        req = request || {};
    
    workflow.on('validateParams', ()=>{
        var errors = [];
        console.log(req);
        if (!req.name){
            errors.push('Event\'s name required');
        }
        if (!req.desc){
            errors.push('Event\'s description required');
        }
        if (!req.date){
            errors.push('Event\'s time required');
        }
        if (!req.nA){
            errors.push('Amount of A tickets required');
        }
        if (!req.nB){
            errors.push('Amount of B tickets required');
        }
        workflow.emit('finishValidate', errors);
    });

    workflow.on('finishValidate', (errors)=>{
        console.log('finishValidate');
        if (errors.length){
            console.log('Error validation', errors);
            cb(errors);
        } else {
            workflow.emit('addEvent');
        }
    });

    workflow.on('addEvent', () => {
        var event = new Event({
            name: req.name,
            desc: req.desc,
            date: Date.parse(req.date)
        });

        for(let i=0;i<req.nA;i++){
            event.tickets.push({
                kind: 'A',
                buyer: ''
            });
        }
        for(let i=0;i<req.nB;i++){
        event.tickets.push({
                kind: 'B',
                buyer: ''
            });
        }

        event.save((err) => {
            if (err) {
                return cb(err);
            }
            return cb(null, {'message': 'Add successfully'});
        })
    });

    workflow.emit('validateParams');
};

var deleteEvent = (request, callback) => {
    var cb = callback || noop,
        req = request || {};
    Event.remove({_id: req.id}, (err) => {
        if (!err) {
                cb(null, {message: 'Delete successfully!'});
            } else {
                console.log(err);
                cb(null,{message: 'Error!'});
            }
        });
};

var purchaseTicket = (request, callback) => {
    var cb = callback || noop,
        req = request || {};
    Event.findOne({_id: req.EventID}, (err, ev) => {
        let status = false;
      //  console.log("event: ", ev);
        //return cb(null, {});
        for(let i=0;i<ev.tickets.length; i++){
            if (ev.tickets[i] === 'undefined') {
                continue;
            }
            
            if (ev.tickets[i].buyer == '' && ev.tickets[i].kind == req.kindOfTicket){
                status = true;
                ev.tickets[i].buyer = req.BuyerID;
                ev.save((err) => {
                    if (err){
                        console.log(err);
                        return cb(err, { message: 'Buy failed.'});
                    } else {
                        User.findOne({id: req.BuyerID}, (err,user)=>{
                            user.events.push({EventID: req.EventID});
                            user.save((err) => {
                                if (err){
                                    console.log(err);
                                    return cb(err, { message: 'Buy failed.'});
                                } else {
                                    return cb(null, {message: 'Buy successfully'});
                                }  
                            });
                        });
                    }   
                });
                break;
            }
        };
        if (!status) {
            cb(null,{message: req.kindOfTicket+' Ticket is out of stock'});
        }
    });
};

exports = module.exports = {
    listEvents: listEvents,
    addEvent: addEvent,
    deleteEvent: deleteEvent,
    purchaseTicket: purchaseTicket
}