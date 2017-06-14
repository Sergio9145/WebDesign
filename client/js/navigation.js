function ReplaceContentInContainer(contentPage) {
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
}