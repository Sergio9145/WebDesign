//
// # SimpleServer
//
var http = require('http');
var path = require('path');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

var mongoose = require('mongoose');
var Post = require('./models/Post.js');

// Establish mLab connection
mongoose.connect('mongodb://instagram_user:instagram982@ds159371.mlab.com:59371/webdesign_db');

// Static usage:
//tell the router (ie. express) where to find static files
router.use(express.static(path.resolve(__dirname, 'client')));
//tell the router to parse JSON data for us and put it into req.body
router.use(express.bodyParser());

// Give all the posts in DB
function updateContent(res)
{
    //go find all the posts in the database
	Post.find({})
	.then(function(paths){
	//send them to the client in JSON format
	res.json(paths);
	});
}

// Handle a POST-request to /postsContent
router.post('/postsContent', function(req, res){
    console.log('Client sends POST request for \'postsContent\' in posts.html');
    
    updateContent(res);
});

var postCounter = 0;
router.post('/addPost', function(req, res){
	console.log('Client sends POST request for \'addPost\' in posts.html');
	
	postCounter++;

	var post1 = new Post({
		image: 'img/kitty' + (postCounter%5+1) + '.jpg',
		comment: 'Cool picture!',
		likeCount: 0,
		feedbackCount: 0
	});
	
	post1.save(function(err) {
	  if (err) {
	    console.log(err);
	  }
	  else {
	    console.log('Post #' + postCounter + ' created!');
	  }
	});
	
    updateContent(res);
});
    
// Example of GET request:
// router.get('/bodyContent', function(req, res) {
//   console.log('Client requests bodyContent for posts.html');
//   res.sendfile(path.join(__dirname, 'client/view', 'posts.html'));
// });

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Instagram clone ready!");
});
