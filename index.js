var express = require('express');
var Firebase = require('firebase');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var db = new Firebase("https://spartahack2016.firebaseio.com");
var user = require('./refs/user.js');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname,'views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/*app.use(function(request, response, next) {
  response.locals.user = request.user;
  next();
});*/

app.get('/signin', function(req,res){
	//res.render('signin');
	res.sendFile(path.join(__dirname, 'views/signin.html'));
});
app.post('/signin', user.postLogin);
app.get('/signup', function(req,res){
	res.sendFile(path.join(__dirname, 'views/signup.html'));
});
app.post('/signup', user.postSignup);
app.get('/', function(req,res){
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

exports.app = app;

