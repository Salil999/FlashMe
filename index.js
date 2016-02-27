var express = require('express');
var app = express();
var Firebase = require('firebase');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var db = new Firebase("https://spartahack2016.firebaseio.com");
var users =  db.child('users');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname,'/views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/*app.use(function(request, response, next) {
  response.locals.user = request.user;
  next();
});*/
app.set('views', path.join(__dirname,'/views/'));
app.set('view engine', 'jade');
app.get('/', function(req,res){
	//res.sendFile(path.join(__dirname, 'views/index.html'));
	res.render('index');
});
app.get('/signup', function(req,res){
	res.render('signin');
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

exports.app = app;

