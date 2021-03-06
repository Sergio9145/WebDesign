/*global $ onGetMenu*/
function onSignIn() {
    var email = $('#email').val();
    var password = $('#password').val();
    
    if (email.length > 0 && password.length > 0){
        Promise.resolve()
        .then(function(){
            return $.post('signin', 'username=' + email + '&password=' + password);
        })
        .then(function(auth){
            if (auth.isValid){
                $('#error').text = 'User signed in';
                $('#bodyContent').html('');
                $("#bodyContent").load("posts.html");

				//* should exist somewhere:
				onGetMenu();
            } else {
                $('#error').html(auth.message);
                $('#email').html('');
                $('#password').html('');
            }
        })
        .catch(function(err){
            console.log(err);
        });
    } else {
        $('#error').html('Please provide both username and password');
    }
}
