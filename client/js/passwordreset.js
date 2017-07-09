/*global $*/
function handleResetAttempt(){
    var email = $('#email').val();
    var password = $('#password').val();
    var repeatPassword = $('#repeat_password').val();
    
    if (email.length > 0 && password.length > 0 && repeatPassword.length > 0 && password == repeatPassword){
        Promise.resolve()
        .then(function(){
            return $.post('passwordreset', {email: email, password: password});
        })
        .then(function(data){
            $('#error').html('go check your email, dummy');
        })
        .catch(function(err){
            console.log(err);
        })
    } else {
        $('#error').html('Please provide both username and password and ensure passwords match.');
    }
}
