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
const fileUpload = require('express-fileupload');
const Guid = require('guid');
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
const Like = require('./models/Like.js');
const PasswordReset = require('./models/PasswordReset.js');
//sendmail
const email = require('./js/send_mail.js');

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
  secret: process.env.SESSION_SECRET || 'mySecretKey', 
  store: mongoSessionStore,
  resave: true,
  saveUninitialized: false
}));
//add passport for authentication support
router.use(passport.initialize());
router.use(passport.session());
userAuth.init(passport);
//add file upload support
router.use(fileUpload());

// tell the router how to handle a get request to the signin page
// router.get('/signin', function(req, res){
//   console.log('client requests signin');

// });

//tell the router how to handle a post request from the signin page
router.post('/signin', function(req, res, next) {
  //tell passport to attempt to authenticate the login
  passport.authenticate('login', function(err, user, info) {
    //callback returns here
    if (err){
      //if error, say error
      res.json({isValid: false, message: 'Internal error'});
    } else if (!user) {
      //if no user, say invalid login
      res.json({isValid: false, message: 'Try again. Login attempt was unsuccessful.'});
    } else {
      //log this user in
      req.logIn(user, function(err){
        if (!err)
          //send a message to the client to say so
          res.json({isValid: true, message: 'Welcome, ' + user.email + '.'});
      });
    }
  })(req, res, next);
});

//tell the router how to handle a get request to the join page
// router.get('/join', function(req, res){
//   console.log('client requests join');
//   res.sendFile(path.join(__dirname, 'client/view', 'join.html'));
// });

//tell the router how to handle a post request to the join page
router.post('/join', function(req, res, next) {
  passport.authenticate('signup', function(err, user, info) {
    if (err){
      res.json({isValid: false, message: 'Internal error.'});    
    } else if (!user) {
      res.json({isValid: false, message: 'Try again. User is not created or already exists.'});
    } else {
      //log this user in since they've just joined
      req.logIn(user, function(err){
        if (!err)
          //send a message to the client to say so
          res.json({isValid: true, message: 'User ' + user.email + ' added!'});
      });
    }
  })(req, res, next);
});

// router.get('/passwordreset', (req, res) => {
//   console.log('client requests passwordreset');
//   res.sendFile(path.join(__dirname, 'client/view', 'passwordreset.html'));
// });

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
            email.send(req.body.email, 'Password reset', 'https://webdesign-opryshko.c9users.io/verifypassword?id=' + pr.id);
          }
        });
      }
    });
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
    });
});

// Give all the posts in DB
function updateContent(req, res)
{
    console.log('Inside updateContent()');
    var thesePosts;
    
    //go find all the posts in the database
    Post.find({})
    .then(function(posts){
    thesePosts = posts;
    var promises = [];
    thesePosts.forEach(function(post){
      promises.push(
        Promise.resolve()
        .then(function(){
          return Like.findOne({userId: req.user.id, postId: post.id})
        })
        .then(function(like){
          return post._doc.isLikedByMe = like ? true : false;
      }));
    });
    return Promise.all(promises);
    })
    .then(function(){
    //send them to the client in JSON format
    return res.json(thesePosts);
    })
}

// Handle a POST-request to /postsContent
router.post('/postsContent', userAuth.isAuthenticated, function(req, res){
    console.log('Client sends POST request \'postsContent\' in posts.html');
    updateContent(req, res);
});

// Handle a POST-request to /postsContent
router.post('/logout', userAuth.isAuthenticated, function(req, res){
    console.log('Server receives POST request \'logout\' in posts.html');
	//* TODO: Make more versatile:
    var response = {success: false, message: ''};
	req.session.destroy();
	response.success = true;
    response.message = 'logged out';
    res.json(response);
});

//* Old code:
// router.post('/addPost', userAuth.isAuthenticated, function(req, res){
// 	console.log('Client sends POST request \'addPost\' in posts.html');

// 	var post1 = new Post({
// 		userId: req.user.id,
// 		image: 'img/kitty' + (postCounter%5 + 1) + '.jpg',
// 		comment: 'Cool picture comment #' + (postCounter + 1) + '!',
// 		likeCount: 0,
// 		feedbackCount: 0
// 	});
	
//     postCounter++;

//     post1.save(function(err) {
// 	  if (err) {
// 	    console.log(err);
// 	  }
// 	  else {
// 	    console.log('Post #' + postCounter + ' created!');
// 	  }
// 	})
// 	.then(function(){
// 	    return updateContent(req, res);
// 	});
// });

router.post('/removePosts', userAuth.isAuthenticated, function(req, res){
	console.log('Client sends POST request \'removePosts\' in posts.html');

    postCounter = 0;

    Post.remove({})
	.then(function(){
	    return updateContent(req, res);
	});
});

router.post('/incrLike', userAuth.isAuthenticated, function(req, res){
  console.log('Client sends POST request \'incrLike\' for ID ' + req.body.id + ' by user ' + req.user.email + ' in posts.html');

  Like.findOne({userId: req.user.id, postId: req.body.id})
  .then(function(like){
    if (!like){
      //go get the post record
      Post.findById(req.body.id)
      .then(function(post){
        //increment the like count
        post.likeCount++;
        //save the record back to the database
        return post.save(post);
      })
      .then(function(post){
        var like = new Like();
        like.userId = req.user.id;
        like.postId = req.body.id;
        like.save();
        
        //a successful save returns back the updated object
        return res.json({id: req.body.id, count: post.likeCount});  
      })
    } else {
        return res.json({id: req.body.id, count: -1});  
    }
  })
  .catch(function(err){
    console.log(err);
  })
});

var postCounter = 0;

//tell the router how to handle a post request to upload a file
router.post('/upload', userAuth.isAuthenticated, function(req, res) {
  var response = {success: false, message: ''};
  
  if (req.files){
    // The name of the input field is used to retrieve the uploaded file 
    var userPhoto = req.files.userPhoto;
    //invent a unique file name so no conflicts with any other files
    var guid = Guid.create();
    //figure out what extension to apply to the file
    var extension = '';
    switch(userPhoto.mimetype){
      case 'image/jpeg':
        extension = '.jpg';
        break;
      case 'image/png':
        extension = '.png';
        break;
      case 'image/bmp':
        extension = '.bmp';
        break;
      case 'image/gif':
        extension = '.gif';
        break;
    }
    
    //if we have an extension, it is a file type we will accept
    if (extension){
      //construct the file name
      var filename = guid + extension;
      // Use the mv() method to place the file somewhere on your server 
      userPhoto.mv('./client/img/' + filename, function(err) {
        //if no error
        if (!err){
			var post1 = new Post({
				userId: req.user.id,
				image: './img/' + filename,
				comment: 'Cool picture comment #' + (postCounter + 1) + '!',
				likeCount: 0,
				feedbackCount: 0
			});

		    postCounter++;

            Promise.resolve(
		    post1.save(function(err) {
			  if (err) {
			    console.log(err);
			  }
			  else {
			    console.log('Post #' + postCounter + ' created!');
			  }
			}))
			.then(function(){
			    return updateContent(req, res);
			});
        } else {
          response.message = 'internal error';
          res.json(response);
        }
      });
    } else {
      response.message = 'unsupported file type';
      res.json(response);
    }
  } else {
    response.message = 'no files';
    res.json(response);
  }
});

router.post('/getmenu', function(req, res) {
	if (!req.isAuthenticated())
	{
	    console.log('Client sends POST request \'getmenu\' and is NOT authenticated');
		res.json('<ul class="nav navbar-nav navbar-right">' +
					'<li><a class="a_icon" href="javascript:ReplaceContentWith(\'join\')">Register</a></li>' +
					'<li><a class="a_icon" href="javascript:ReplaceContentWith(\'signin\')">Sign In</a></li>' +
				'</ul>')
	}
	else
	{
	    console.log('Client sends POST request \'getmenu\' and is authenticated');
		res.json('<ul class="nav navbar-nav navbar-right">' +
					'<li><a class="a_icon" href="javascript:ReplaceContentWith(\'posts\')"><img id="like" src="img/Like.png" alt="Like Button"></a></li>'+
					'<li><a class="a_icon" href="javascript:ReplaceContentWith(\'profile\')"><img id="profile" src="img/Profile.png" alt="Profile Button"></a></li>' +
					'<li><a class="a_icon" href="javascript:onLogout()">Logout</a></li>' +
				'</ul>')
	}
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Instagram clone ready!");
});
