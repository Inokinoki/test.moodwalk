import md5 from "md5"

import { validateUsername, validatePassword, validateLength } from "./Validate.jsx"

function getUsername(id, tipper){
    var username = document.getElementById(id).value;
    if(validateUsername(username, "login-wrong-tip",
        "<div class='alert alert-danger' role='alert'>Please input your username</div>"))
        return username;
    else
        return false;
}

function getRawPassword(id, tipper){
    var e_password = document.getElementById(id);
    if (validatePassword(e_password.value, "wrong-tip",
    "<div class='alert alert-danger' role='alert'>Password too short</div>")){
        return e_password.value;
    } else
        return false;
}

function getPassword(id, tipper){
    var e_password = document.getElementById(id);
    if (validatePassword(e_password.value, "login-wrong-tip",
    "<div class='alert alert-danger' role='alert'>Password too short</div>")){
        var encrypted = md5(e_password.value);
        e_password.value = encrypted;
        return encrypted;
    } else
        return false;
}

module.exports = {getUsername, getPassword, getRawPassword};