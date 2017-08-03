/*global $*/
/* Function used to update user's page on POST-requests */
function updateContent(posts){
    //jQuery function to set the innerHTML of the div with id = 'postsContent' to empty
    $('#postsContent').html('');
    var lorem = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

    posts.forEach(function(post){
		var likeString = '';

		if (post.isLikedByMe)
			likeString = 'I liked this!';

        //jQuery function to append to the innterHTML of the div with id = 'postsContent'
        $('#postsContent').append(
            '<nav class="navbar navbar-default" style="width:490px; margin:20px auto;">' +
            '<div style="margin:20px;" data-postId="' + post._id + '">' +
            '<img src="' + post.image + '" width="450" height="450"/>' +
            '<div class="container-fluid" style="padding:0px; margin:10px 0 0 0;">' +
            '<p><b>' + post.comment + '</b> ' + lorem + ' <b>Post ID:</b> ' + post._id + '.</p></div>' +
            '<ul class="nav navbar-nav navbar-right">' +
                '<li><p class="navbar-text" id="ilikethis">' + likeString + '</p></li>' +
                '<li><p class="navbar-text">Like Count: ' +
                    '<span id ="like' + post._id + '">' + post.likeCount + '</span></p></li>' +
                '<li><button onclick="onLikeClick(\'' + post._id + '\');" class="btn btn-default navbar-btn">Like</button></li>' +
            '</ul></div></nav>'
        );
    });
}

function onContentLoad(){
    //start a promise chain
    Promise.resolve()
    .then(function(){
        //jQuery function to request all the posts from the server
        //the 'return' is required. Otherwise, the subsequent then will not wait for this to complete
        return $.post('postsContent');
    })
    //when the server responds, we'll execute this code
    .then(function(posts){
    	return updateContent(posts);
    })
    .catch(function(err){
        //always include a catch for exceptions
        console.log(err);
    });
} // onContentLoad()

// function onAddPost(){
//     //start a promise chain
//     Promise.resolve()
//     .then(function(){
//         //jQuery function to request all the posts from the server
//         //the 'return' is required. Otherwise, the subsequent then will not wait for this to complete
//         return $.post('addPost');
//     })
//     //when the server responds, we'll execute this code
//     .then(function(posts){
//     	return updateContent(posts);
//     })
//     .catch(function(err){
//         //always include a catch for exceptions
//         console.log(err);
//     });
// } // onAddPost()

function onRemovePosts(){
    Promise.resolve()
    .then(function(){
        //jQuery function to request all the posts from the server
        //the 'return' is required. Otherwise, the subsequent then will not wait for this to complete
        return $.post('removePosts');
    })
    //when the server responds, we'll execute this code
    .then(function(posts){
        return updateContent(posts);
    })
    .catch(function(err){
        //always include a catch for exceptions
        console.log(err);
    });
} // onRemovePosts()

function onLikeClick(id){
    Promise.resolve()
    .then(function(){
        //jQuery provides a nice convenience method for easily sending a post with parameters in JSON
        //here we pass the ID to the incrLike route on the server side so it can do the incrementing for us
        //note the return. This MUST be here, or the subsequent then will not wait for this to complete
        return $.post('incrLike', {id : id});
    })
    .then(function(like){
        //jQuery provides a nice convenience methot for easily setting the count to the value returned
    	return onContentLoad();
    })
    .catch(function(err){
        //always include a catch for the promise chain
        console.log(err);
    });
} // onLikeClick()

//upload picture handler
function onImageUpload(){
    //go get the data from the form
    var form = new FormData($("#uploadForm")[0]);
    
    //we can post this way as well as $.post
    Promise.resolve()
    .then(function(){
		$.ajax({
		        url: '/upload',
		        method: "POST",
		        dataType: 'json',
		        //the form object is the data
		        data: form,
		        //we want to send it untouched, so this needs to be false
		        processData: false,
		        contentType: false,
		        //add a message 
		        success: function(result){},
		        error: function(er){}
		});
    })
    //when the server responds, we'll execute this code
    .then(function(posts){
    	return updateContent(posts);
    })
    .catch(function(err){
        //always include a catch for exceptions
        console.log(err);
    });
} // onImageUpload()
