var db = new Firebase("https://spartahack2016.firebaseio.com");
var users =  db.child('users');
var tokenGen = require('firebase-token-generator');
//var token = tokenGen.createToken();
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req,res){
	db.authWithPassword({
		email: req.body.email,
		password: req.body.password
	}, function(err, authData){
		if(err){
			console.log("err!");
		}
		else{
			console.log("auth succes ! ", authData);
			res.redirect('/');
		}
	}, { remember: "sessionOnly"});
};
/**
 * POST /signup
 * Sign in using email and password.
 */
exports.postSignup = function(req, res) {

	db.createUser({
		email: req.body.email,
		password: req.body.password
	}, function(error, authData){
		if(error){
			console.log("err: ", error);
		}
		else {
			console.log("success! with uid: ", authData.uid);
			/* after the user is signed, log him/her in (Firebase DOES NOT do this for you) */
			db.authWithPassword({
				email: req.body.email,
				password: req.body.password
			}, function(err, authData){
				if(err){
					console.log("err! " + err);
				}
				else{
					console.log("auth succes ! ", authData);
					res.redirect('/');
				}
			}, { remember: "sessionOnly" });
			db.onAuth(function(data){
				users.child(authData.uid).set({
					name:toTitleCase(req.body.name)
				});
			});
		}
	});

};

var toTitleCase = function(str){
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

exports.getProfile = function(req,res){
	var authData = db.getAuth();
	if(!authData) {
		console.log("need to be logged in !");
		res.redirect('/');
	}
	var id = authData.uid;
	if(req.params.uid!=id){
		console.log("invalid address");
		res.redirect('/');
	}
	(users.child(id)).on('value',function(snapshot){
		//var data = users.child(id).key();
		var username = authData.password.email;
		var name = snapshot.val().name;
		var classes = snapshot.val().classes;
		console.log("username:"+username);
		res.render('profile', {username: username , name: name, classes: classes });
	});

};
