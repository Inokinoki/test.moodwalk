function validateUsername(username, error_message_block_id, error_message){
    if (username.length < 1){
        document.getElementById(error_message_block_id).innerHTML = error_message;
                //"<div class='alert alert-danger' role='alert'>Please input your username</div>";
        return false;
    }
    return true;
}

function validatePassword(password, error_message_block_id, error_message){
    if (password.length<4){
        document.getElementById(error_message_block_id).innerHTML = error_message;
                //"<div class='alert alert-danger' role='alert'>Password too short</div>";
        return false;
    }
    return true;
}

function validateLength(text, name, min_length, error_message_id, error_message){
    if (text.length < min_length){
        document.getElementById(error_message_block_id).innerHTML = error_message;
                //"<div class='alert alert-danger' role='alert'>"+ name +" length not match</div>";
        return false;
    }
    return true;
}

module.exports = {validateUsername, validatePassword, validateLength};