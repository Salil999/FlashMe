var db = new Firebase("https://spartahack2016.firebaseio.com");
var users = db.child('users');
var tokenGen = require('firebase-token-generator');

//var token = tokenGen.createToken();
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res) {
    db.authWithPassword({
        email: req.body.email,
        password: req.body.password
    }, function(err, authData) {
        if (err) {
            console.log("err!");
        } else {
            console.log("auth succes ! ", authData);
            res.redirect('/');
        }
    }, { remember: "sessionOnly" });
};
/**
 * POST /signup
 * Sign in using email and password.
 */
exports.postSignup = function(req, res) {

    db.createUser({
        email: req.body.email,
        password: req.body.password
    }, function(error, authData) {
        if (error) {
            console.log("err: ", error);
        } else {
            console.log("success! with uid: ", authData.uid);
            /* after the user is signed, log him/her in (Firebase DOES NOT do this for you) */
            db.authWithPassword({
                email: req.body.email,
                password: req.body.password
            }, function(err, authData) {
                if (err) {
                    console.log("err! " + err);
                } else {
                    console.log("auth succes ! ", authData);
                    res.redirect('/');
                }
            }, { remember: "sessionOnly" });
            db.onAuth(function(data) {
                users.child(authData.uid).set({
                    name: toTitleCase(req.body.name)
                });
            });
        }
    });

};

var toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

exports.getProfile = function(req, res) {
    var authData = db.getAuth();
    if (!authData) {
        console.log("need to be logged in !");
        res.redirect('/');
        return;
    }
    var id = authData.uid;
    if (req.params.uid != id) {
        console.log("invalid address");
        res.redirect('/');
    }
    var username;
    var name;
    var classes = [];
    (users.child(id)).once('value', function(snapshot) {
        username = authData.password.email;
        name = snapshot.val().name;
        users_classes = snapshot.val().classes;
        console.log(users_classes);
        for(var class_obj in users_classes){
            classes.push(users_classes[class_obj].class_name);
        }
        console.log("classes:"+classes);
        res.render('profile', { username: username, name: name, classes: classes });
    });
};
exports.addClass = function(req, res) {
    var authData = db.getAuth();
    if (!authData) {
        console.log("need to be logged in");
        res.redirect('/');
        return;
    }
    var id = authData.uid;
    //console.log(" " + (users.child(id)).child("name"));
    (users.child(id)).child("classes").push().set({
        class_name : req.params.class_name,
        questions: [0]
    });
};
/* for now this link just lets users add questions for a class, later we need to add a link that lets them take a quiz */
exports.getClass = function(req,res){
    //console.log("got a get request for get class");
    var authData = db.getAuth();
    if(!authData){
        console.log("need to be logged in");
        res.redirect('/');
        return;
    }
    var id = authData.uid;
    var class_name = req.params.class_name;
    //console.log("class_name "+ class_name );
    var questions = [];
    (users.child(id)).once('value', function(snapshot){
        var users_classes = snapshot.val().classes;
        for(var class_obj in users_classes){
            var class_n = users_classes[class_obj].class_name;
            //console.log(class_n);
            if(class_n==class_name){ // found the class we need to show questions for
                //console.log(users_classes[class_obj].questions);
                the_questions = users_classes[class_obj].questions;
                for(var index in the_questions){
                    if(the_questions[index]===0) continue;
                    questions.push(the_questions[index]);
                }
            }
        }
        //console.log(questions);
        res.render('class', { username: authData.password.email, class_name: class_name, questions: questions});
    });
};
exports.postClass = function(req,res){
    var authData = db.getAuth();
    if(!authData){
        console.log("need to be logged in");
        res.redirect('/');
        return;
    }
    var id = authData.uid;
    var class_name = req.params.class_name;

    (users.child(id)).child('classes').once('value',function(snapshot){
        snapshot.forEach(function(item){
            if(item.val().class_name==class_name){ /* this is the class we want to add to*/
                users.child(id).child('classes').child(item.key()).child('questions').push(req.body.question);
                res.redirect('/class/'+class_name);
            }
        });
    });
};