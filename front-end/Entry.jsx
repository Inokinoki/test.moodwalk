import React from "react"
import ReactDOM from "react-dom"

import ReposStared from './src/ReposStared.jsx'
import ReposSearched from './src/ReposSearched.jsx'
import login from "./src/Login.jsx"
import logout from './src/Logout.jsx'
import register from "./src/Register.jsx"

// Export to Window
window.login = login;
window.logout = logout;
window.register = register;

ReactDOM.render(<ReposStared />, 
    document.getElementById("repo-star-show-block"));

ReactDOM.render(<ReposSearched />, 
    document.getElementById("repo-show-block"));