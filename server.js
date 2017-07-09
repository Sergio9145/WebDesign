//
// Instagram Clone
// by Sergiy Opryshko
//

const mongoURL = 'mongodb://instagram_user:instagram982@ds159371.mlab.com:59371/webdesign_db';

// require statements -- this adds external modules from node_modules or our own defined modules
const http = require('http');
const path = require('path');
// express related
const express = require('express');
const bodyParser = require('body-parser');
//session
const session = require('express-session');  
const mongoSession = require('connect-mongodb-session')(session);
const passport = require('passport');
const userAuth = require('./js/user_auth.js');
const hash = require('./js/hash.js');
//database
const mongoose = require('mongoose');
const Post = require('./models/Post.js');
const User = require('./models/User.js');
const PasswordReset = require('./models/PasswordReset.js');

var router = express();
var server = http.createServer(router);

// Establish mLab connection
mongoose.connect(mongoURL);

//create a sessions collection as well
var mongoSessionStore = new mongoSession({
    uri: mongoURL,
    collection: 'sessions'
});

//tell the router (ie. express) where to find static files
router.use(express.static(path.resolve(__dirname, 'client')));
//tell the router to parse JSON data for us and put it into req.body
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//add session support
router.use(session({
  secret: process.env.SESSION_SECRET || ',tpyfls]cgjlsdf.cm', 
  store: mongoSessionStore,
  resave: true,
  saveUninitialized: false
}));
//add passport for authentication support
router.use(passport.initialize());
router.use(passport.session());
userAuth.init(passport);

//tell the router how to handle a get request to the signin page
router.get('/signin', function(req, res){
  console.log('client requests signin');
  res.redirect('/');
});

//tell the router how to handle a post request from the signin page
router.post('/signin', function(req, res, next) {
  //tell passport to attempt to authenticate the login
  passport.authenticate('signin', function(err, user, info) {
    //callback returns here
    if (err){
      //if error, say error
      res.json({isValid: false, message: 'internal error'});
    } else if (!user) {
      //if no user, say invalid login
      res.json({isValid: false, message: 'try again'});
    } else {
      //log this user in
      req.logIn(user, function(err){
        if (!err)
          //send a message to the client to say so
          res.json({isValid: true, message: 'Welcome, ' + user.email});
      });
    }
  })(req, res, next);
});

//tell the router how to handle a get request to the join page
router.get('/join', function(req, res){
  console.log('client requests join');
  res.sendFile(path.join(__dirname, 'client/view', 'join.html'));
});

//tell the router how to handle a post request to the join page
router.post('/join', function(req, res, next) {
  passport.authenticate('signup', function(err, user, info) {
    if (err){
      res.json({isValid: false, message: 'internal error'});    
    } else if (!user) {
      res.json({isValid: false, message: 'try again'});
    } else {
      //log this user in since they've just joined
      req.logIn(user, function(err){
        if (!err)
          //send a message to the client to say so
          res.json({isValid: true, message: 'welcome ' + user.email});
      });
    }
  })(req, res, next);
});

router.get('/passwordreset', (req, res) => {
  console.log('client requests passwordreset');
  res.sendFile(path.join(__dirname, 'client/view', 'passwordreset.html'));
});

router.post('/passwordreset', (req, res) => {
    Promise.resolve()
    .then(function(){
        //see if there's a user with this email
        return User.findOne({'email' : req.body.email});
    })
    .then(function(user){
      if (user){
        var pr = new PasswordReset();
        pr.userId = user.id;
        pr.password = hash.createHash(req.body.password);
        pr.expires = new Date((new Date()).getTime() + (20 * 60 * 1000));
        pr.save()
        .then(function(pr){
          if (pr){
            email.send(req.body.email, 'password reset', 'https://prog8165-rtbsoft.c9users.io/verifypassword?id=' + pr.id);
          }
        });
      }
    })
});

router.get('/verifypassword', function(req, res){
    var password;
    
    Promise.resolve()
    .then(function(){
      return PasswordReset.findOne({id: req.body.id});
    })
    .then(function(pr){
      if (pr){
        if (pr.expires > new Date()){
          password = pr.password;
          //see if there's a user with this email
          return User.findOne({id : pr.userId});
        }
      }
    })
    .then(function(user){
      if (user){
        user.password = password;
        return user.save();
      }
    })
});

// Give all the posts in DB
function updateContent(res)
{
    //go find all the posts in the database
	Post.find({})
	.then(function(paths){
	//send them to the client in JSON format
	return res.json(paths);
	});
}

// Handle a POST-request to /postsContent
router.post('/postsContent', function(req, res){
    console.log('Client sends POST request \'postsContent\' in posts.html');
    updateContent(res);
});

var postCounter = 0;

router.post('/addPost', function(req, res){
	console.log('Client sends POST request \'addPost\' in posts.html');

	var post1 = new Post({
		image: 'img/kitty' + (postCounter%5 + 1) + '.jpg',
		comment: 'Cool picture comment #' + (postCounter + 1) + '!',
		likeCount: 0,
		feedbackCount: 0
	});
	
    postCounter++;

    post1.save(function(err) {
	  if (err) {
	    console.log(err);
	  }
	  else {
	    console.log('Post #' + postCounter + ' created!');
	  }
	})
	.then(function(){
	    return updateContent(res);
	})
});

router.post('/removePosts', function(req, res){
	console.log('Client sends POST request \'removePosts\' in posts.html');

    postCounter = 0;

    Post.remove({})
	.then(function(){
	    return updateContent(res);
	})
});

router.post('/incrLike', function(req, res){
  console.log('Client sends POST request \'incrLike\' for ID ' + req.body.id + ' in posts.html');

  Post.findById(req.body.id)
  .then(function(post){
    post.likeCount++;
    return post.save(post);
  })
  .then(function(post){
    res.json({id: req.body.id, count: post.likeCount});
  })
  .catch(function(err){
    console.log(err);
  })
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Instagram clone ready!");
});
