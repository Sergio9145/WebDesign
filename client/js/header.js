/* global $ */
function ReplaceContentWith(contentPage) {
	if (contentPage == "main")
	{
		$('#bodyContent').html('');
		$("#bodyContent").load("about.html");
	}
	if (contentPage == "profile")
	{
		$('#bodyContent').html('');
		$("#bodyContent").load("profile.html");
	}
	if (contentPage == "posts")
	{
		$('#bodyContent').html('');
		$("#bodyContent").load("posts.html");
	}
	if (contentPage == "about")
	{
		$('#bodyContent').html('');
		$("#bodyContent").load("about.html");
	}
	if (contentPage == "join")
	{
		$('#bodyContent').html('');
		$("#bodyContent").load("join.html");
	}
	if (contentPage == "signin")
	{
		$('#bodyContent').html('');
		$("#bodyContent").load("signin.html");
	}
	if (contentPage == "passwordreset")
	{
		$('#bodyContent').html('');
		$("#bodyContent").load("passwordreset.html");
	}
}

function onLogout() {
    Promise.resolve()
    .then(function(){
        return $.post('logout');
    })
    .then(function(message){
    	console.log(message);
    	ReplaceContentWith("main");
    	onGetMenu();
    })
}

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
} // onGetMenu()
