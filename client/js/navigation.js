function ReplaceContentWith(contentPage) {
	if (contentPage == "main")
	{
		$('#bodyContent').html('');
		$("#bodyContent").load("changelog.html");
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

var menu = 'register';

function ShowHeaderMenu() {
	if (menu == "register")
	{
		$('#menuContent').html('');
		$("#menuContent").load("registermenu.html");
	}
	
	if (menu == "user")
	{
		$('#menuContent').html('');
		$("#menuContent").load("usermenu.html");
	}
}