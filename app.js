var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser');

var swaggerJSDoc = require('swagger-jsdoc');
var path = require('path');
var fs = require('fs');
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/docs', express.static(path.join(__dirname, 'docs')))

//setup controllers
controllers = require('./app/controllers/index');
//setup modules
modules = require('./app/modules/index');

require('./app/routes')(app,controllers);


var apis = [];
var dir = __dirname + '/app/routes';
console.log ('dir ', dir);
fs.readdirSync(dir).forEach(function(file) {
        if (file == "index.js") return;
        apis.push('./app/routes/' + file);
    });
var options = {
  swaggerDefinition: {
    info: {
      title: 'Uvent API', // Title (required)
      description: 'This is API document for Uvent App',
      version: '1.0.0', // Version (required)
    },
  },
  apis: apis, // Path to the API docs
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);

app.get('/api-docs.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
/*app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;