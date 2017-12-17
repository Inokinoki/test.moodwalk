/**
 * Logout Module
 */
function logout(){
    $.get("./api/logout.php", onLogoutReceive );
}

function onLogoutReceive(data, status){
    if (status){
        let result = JSON.parse(data);
        if (result["state"] == "0"){
            document.cookie = "uuid = ''"; 
            window.location.reload();
        }
    } else {
        alert("Internet Error When logout");
    }
}

module.exports = logout;