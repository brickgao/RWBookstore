
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var flash = require('connect-flash');
var sqlite3 = require('sqlite3').verbose();
var http = require('http');
var path = require('path');
var settings = require('./settings');

var db = new sqlite3.Database(settings.db);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.cookieParser('keyboard cat'));
app.use(express.session({ 
  secret: settings.cookieSecret,
  cookie: { maxAge: 600000 }
}));
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
