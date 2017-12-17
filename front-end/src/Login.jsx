import {getUsername, getPassword} from "./Getter.jsx"

/**
 * Login Module
 */
function login(){
    document.getElementById("comfirm-login-button").setAttribute("disabled","disabled");
    document.getElementById("login-wrong-tip").innerHTML = 
        "<div class='alert alert-info' role='alert'>Loging...</div>";
    var username = getUsername("input-login-username");
    var password = getPassword("input-login-password");
    if (username && password){
        $.post("./api/login.php",
            {
                username : username,
                password : password
            }, onLoginReceive );
    } else {
        resetLogin();
    }
}

function onLoginReceive(data, status){
    if (status){
        let result = JSON.parse(data);
        if (result["state"] == "0"){
            document.cookie = "uuid = " + result["description"]; 
            window.location.reload();
        } else {
            document.getElementById("login-wrong-tip").innerHTML = 
                "<div class='alert alert-danger' role='alert'>"+result["description"]+"</div>";
        }
    } else {
        alert("Internet Error");
        document.getElementById("login-wrong-tip").innerHTML = "";
    }
    cleanPassword();
    document.getElementById("comfirm-login-button").removeAttribute("disabled");
}

function cleanPassword(){
    let e_password = document.getElementById("input-login-password");
    if (e_password)
        e_password.value = "";
}

function resetLogin(){
    cleanPassword();
    document.getElementById("comfirm-login-button").removeAttribute("disabled");
}

module.exports = login;