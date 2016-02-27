var express = require('express');
var app = express();
var Firebase = require('firebase');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var db = new Firebase("https://spartahack2016.firebaseio.com");
var users =  db.child('users');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(function(request, response, next) {
  response.locals.user = request.user;
  next();
});
app.get('/', function(req,res){
	console.log("hi ! ");
});
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

exports.app = app;

