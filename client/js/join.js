/*global $*/
function handleJoinAttempt(){
    var email = $('#email').val();
    var password = $('#password').val();
    var repeatPassword = $('#repeat_password').val();
    
    if (email.length > 0 && password.length > 0 && repeatPassword.length > 0 && password == repeatPassword){
        Promise.resolve()
        .then(function(){
            return $.post('join', 'username=' + email + '&password=' + password);
        })
        .then(function(auth){
            if (auth.isValid){
                $('#error').text = 'User created';
                $('#bodyContent').html('');
                $("#bodyContent").load("posts.html");

				//* TODO: change properly!
				// $('#menuContent').html('');
				// $("#menuContent").load("usermenu.html");
            } else {
                $('#error').html(auth.message);
                $('#email').html('');
                $('#password').html('');
                $('#repeat_password').html('');
            }
        })
        .catch(function(err){
            console.log(err);
        })
    } else {
        $('#error').html('Please provide both username and password and ensure passwords match.');
    }
}
