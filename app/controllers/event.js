var mEvent = require('../modules/index').event;
var jwt = require('jsonwebtoken');
var config = require('../config');

var listEvents = (req,res) => {
    mEvent.listEvents({}, (err,response) => {
        res.json({
            result: response && !err ? response : null,
            error: err ? err : null
        });
    });
};

var addEvent = (req, res) => {
    if (req.decoded.admin){
        var request = req.body;
        mEvent.addEvent(request , (err,response)=>{
            res.json({ 
                result: response && !err ? response : null,
                error: err ? err : null
            });
        });
    } else res.json({message: 'You are not admin'});
};

var deleteEvent = (req, res) => {
    if (req.decoded.admin){
        var request = req.body;
        mEvent.deleteEvent(request , (err,response)=>{
            res.json({ 
                result: response && !err ? response : null,
                error: err ? err : null
            });
        });
    } else res.json({message: 'You are not admin'});
};

var purchaseTicket = (req, res) => {
    console.log('JSON decode: ', req.decoded);
    if (!req.decoded.admin){
        var request = {
            EventID: req.body.id,
            kindOfTicket: req.body.kindOfTicket,
            BuyerID: req.decoded.id
        };
        mEvent.purchaseTicket(request , (err,response)=>{
            res.json({ 
                result: response && !err ? response : null,
                error: err ? err : null
            });
        });
    } else res.json({message: 'Admin cannot buy ticket'});
};

exports = module.exports = {
    listEvents: listEvents,
    addEvent: addEvent,
    deleteEvent: deleteEvent,
    purchaseTicket: purchaseTicket
}