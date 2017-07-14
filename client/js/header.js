function onGetMenu(){
    //start a promise chain
    Promise.resolve()
    .then(function(){
        //jQuery function to request all the posts from the server
        //the 'return' is required. Otherwise, the subsequent then will not wait for this to complete
        return $.post('getmenu');
    })
    //when the server responds, we'll execute this code
    .then(function(menu){
    	$('#menuContent').html(menu);
    })
    .catch(function(err){
        //always include a catch for exceptions
        console.log(err);
    });
} // onAddPost()