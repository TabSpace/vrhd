var express = require('express');
var path = require('path');
var app = express();
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var flash = require('connect-flash');

app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
app.use(methodOverride());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(serveStatic(path.join(__dirname, '../public')));
app.use(flash());


app.use(function(req, res, next) {
  app.set('path', req.originalUrl);
  next();
});


require('./routes')(app);

exports.start = function(callback) {
  var server = app.listen(7788, function() {
    callback(server);
  });
};
