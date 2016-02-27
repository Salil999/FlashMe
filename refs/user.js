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
/**
 * GET /logout
 * Log out.
 */
/*exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
*/
/**
 * GET /signup
 * Signup page.
 */
 /*
exports.getSignup = function(request, response) {
  //if (req.user) return res.redirect('/');
  response.render('pages/signup');
  console.log('get ');
};
*/
/**
 * POST /signup
 * Create a new local account.
 */
 /*
exports.postSignup = function(req, res, next) {

User.findOne({where: {username:req.body.username}})
  .then(function(user){
      if(user) {
          req.flash('errors', { msg: 'Account with that email address already exists.' });
          console.log("nope");
          return res.redirect('/signup');
        }
      else{
          var t_user = User.create({
            username: req.body.username,
            password: req.body.password,
            followers: 0,
            following: 0
        }).then(function(t_user){
            req.logIn(t_user,function(err){
            if (err) return next(err);
            return res.redirect('/profile/'+t_user.username);
            });
          });
      }
  });
};
*/

/*** GET PROFILE ***/
/*
exports.getUser = function(req, res) {
  // If no username is specified, go to the logged in user's profile
  console.log(req.user);
  if (!req.params.username) {
    req.params.username = req.user.username;
  }
  User
    .findOne({where: { username: req.params.username }})
    .then(function(user) {
      // Check to see if a user with the specified username exists
      if (!user) {
        req.flash('errors', { msg: 'User with that username does not exist.' });
        console.log("Still weird");
        return res.redirect('/');
      }
      else{
          res.render('pages/profile', { currentuser: req.user.username, username: user.username, followers: user.followers, following: user.following, index: false, profile: true});
        }
    });
};
*/
