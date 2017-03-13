'use strict';
var current,
    processors;
processors = require('./processor/index');

exports = module.exports = (injections) => {
    if (!processors){
        processors = injections;
    }

    if (!current) {
        console.log('Default processor = JSON');
        current = processors.json;
    }
    return {
        render: (req, res, object, options) => {
            if (option && option.processor){
                switch (option.processor) {
                    case 'json': 
                        processors.json.render(req,res,object,options);
                        break;
                    //case 'html':
                      //  processors.html.render(req, res, object, options);
                        //break;
                }
            } else {
                if (req.query.format) {
                    switch (req.query.format) {
                        case 'json':
                            processors.json.render(req, res, object, options);
                            break;
                        //case 'html':
                            //processors.html.render(req, res, object, options);
                            //break;
                    }
                } else {
                    processors.json.render(req, res, object, options);
                }
            }
        }
    }
}
    