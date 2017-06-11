var mongoose = require('mongoose');

module.exports = mongoose.model('Post', {
   image: String,           // url to image file
   comment: String,         // poster's comment
   likeCount: Number,       // number of likes (convenience value)
   feedbackCount: Number    // number of comments from others (convenience value)
});