/**
 * Module dependencies.
 */
var fs = require('fs');

var express = require('express'),
	routes 	= require('./routes'),
	http 	= require('http'),
	https = require('https'),
	path 	= require('path'),
	Const   = require('./sharedConstants').constant,
	
	game 	= require('./game_files/game');

var app = express();

// all environments
app.set('port', Const.SERVER_PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', routes.index);
app.get('/', routes.birds);

// Route to get shared const file
app.get('/sharedConstants.js', function(req, res) {
    res.sendfile('sharedConstants.js');
});


const credentials = {
	key: fs.readFileSync("/etc/letsencrypt/live/flappycoop.com/privkey.pem"),
	cert: fs.readFileSync("/etc/letsencrypt/live/flappycoop.com/fullchain.pem"),
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

httpsServer.listen(443, function(){
  console.log('Express https server listening on port ' + 443);
});

game.startServer();