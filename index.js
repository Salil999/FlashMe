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
app.use(express.static(path.join(__dirname, 'views/public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/*app.use(function(request, response, next) {
  response.locals.user = request.user;
  next();
});*/

app.get('/quiz/:class_name', user.getCards);

app.get('/about', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/about.html'));
});
app.get('/signin', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/signin.html'));
});
app.post('/signin', user.postLogin);
app.get('/signup', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/signup.html'));
});
app.post('/signup', user.postSignup);
/*app.get('/addClass/:class_name', user.addClass);*/
app.get('/profile/:uid', user.getProfile);
app.post('/profile/:uid', user.postProfile);
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});
app.get('/class/:class_name', user.getClass);
app.post('/class/:class_name', user.postClass);
app.get('/main/performance/', user.getPerformanceOptions);
app.get('/performance/:class_name', user.getPerformance);
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

exports.app = app;
