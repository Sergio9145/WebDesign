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
}
