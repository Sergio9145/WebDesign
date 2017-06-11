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

// Refers to a Collection in mLab:
var post1 = new Post({
  image: './client/img/kitty1.jpg',
  comment: 'cool pic!',
  likeCount: 0,
  feedbackCount:0
});

// var post2 = new Post({
//   image: './client/img/kitty2.jpg',
//   comment: 'nice pic!',
//   likeCount: 0,
//   feedbackCount:0
// });

post1.save(function(err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log('posted');
  }
});

// post2.save();

// Static usage:
router.use(express.static(path.resolve(__dirname, 'client')));

// What node.js does on get request:
router.get('/', function(req, res) {
  console.log('client requests posts.html');
  res.sendfile(path.join(__dirname, 'client/view', 'posts.html'));
});

router.post('/', function(req, res) {

});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
