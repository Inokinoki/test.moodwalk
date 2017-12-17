import {getUsername, getRawPassword} from "./Getter.jsx"

/**
 * Register Module
 */
function register(){
    document.getElementById("comfirm-button").setAttribute("disabled","disabled");
    document.getElementById("wrong-tip").innerHTML = 
        "<div class='alert alert-info' role='alert'>Registering...</div>";
    var username = getUsername("input-register-username");
    var password = getRawPassword("input-register-password");
    if (username && password){
        $.post("./api/register.php",
            {
                username : username,
                password : password
            }, onRegisterReceive );
    } else {
        resetRegister();
    }
}

function onRegisterReceive(data, status){
    if (status){
        let result = JSON.parse(data);
        if (result["state"] == "0"){
            alert("Register OK, You can login now.");
        } else {
            document.getElementById("wrong-tip").innerHTML = 
                "<div class='alert alert-danger' role='alert'>"+result["description"]+"</div>";
        }
    } else {
        alert("Internet Error");
        document.getElementById("wrong-tip").innerHTML = "";
    }
    cleanPassword();
    document.getElementById("confirm-button").removeAttribute("disabled");
}

function cleanPassword(){
    let e_password = document.getElementById("register-login-password");
    if (e_password)
        e_password.value = "";
}

function resetRegister(){
    cleanPassword();
    document.getElementById("comfirm-button").removeAttribute("disabled");
}

module.exports = register;