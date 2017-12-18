import React from 'react'
import md5 from 'md5'

/**
 * Navbar
 */

 class Navbar extends React.Component{
     constructor(props){
        super(props);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);

        // Init state
        this.state = {
            username: props.username,
            password: "",
            errorMessage: ""
        };
     }

     register(){
        this.setState({errorMessage: "Register..."});
        if (this.state.username.length < 4){
            this.setState({errorMessage: "Username too short"});
            return;
        }
        if (this.state.password.length < 4){
           this.setState({errorMessage: "Password too short"});
           return;
       }
       $.post("./api/register.php",
            {
                username : this.state.username,
                password : this.state.password
            }, function(data, status){
                if (status){
                    let result = JSON.parse(data);
                    if (result["state"] == "0"){
                        // Hide Modal
                        $('#RegisterModal').modal("hide");
                        $('#LoginModal').modal("hide");
                        this.login();
                    } else {
                        this.setState({errorMessage: result["description"]});
                    }
                } else {
                    alert("Internet Error");
                }
            }.bind(this)
        );
     }

     login(){
         this.setState({errorMessage: "Login..."});
         if (this.state.username.length < 4){
             this.setState({errorMessage: "Username too short"});
             return;
         }
         if (this.state.password.length < 4){
            this.setState({errorMessage: "Password too short"});
            return;
        }
        $.post("./api/login.php",
            {
                username : this.state.username,
                password : md5(this.state.password)
            }, function(data, status){
                if (status){
                    let result = JSON.parse(data);
                    if (result["state"] == "0"){
                        // Hide Modal
                        $('#LoginModal').modal("hide");
                        this.props.afterLoginAction(result["description"], this.state.username); 
                    } else {
                        this.setState({errorMessage: result["description"]});
                    }
                } else {
                    alert("Internet Error");
                }
            }.bind(this)
        );

     }

     logout(){
        $.get("./api/logout.php?token=" + this.props.token , 
            function(data, status){
                if (status){
                    let result = JSON.parse(data);
                    if (result["state"] == "0"){
                        this.props.afterLogoutAction();
                    } else {
                        alert(result["description"]);
                    }
                } else {
                    alert("Internet Error When logout");
                }
            }.bind(this)
        );
     }

     changeUsername(event){
        this.setState({username: event.target.value});
     }

     changePassword(event){
        this.setState({password: event.target.value});
     }

     render(){
        if (this.props.isLogin == true){
            return (
                <div>
                <nav className="navbar navbar-inverse navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="index.php">Test Moodwalk - Inoki</a>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav navbar-right">
                                <li><a href="#!"><span className="glyphicon glyphicon-user" aria-hidden="true"></span> {this.state.username}</a></li>
                                <li><a href="#!" onClick={this.logout}>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                </div> 
            );
        } else {
            return (
                <div>
                    <nav className="navbar navbar-inverse navbar-static-top">
                        <div className="container">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <a className="navbar-brand" href="index.php">Test Moodwalk - Inoki</a>
                            </div>
                            <div id="navbar" className="navbar-collapse collapse">
                                <ul className="nav navbar-nav navbar-right">
                                <li><a data-toggle="modal" data-target="#LoginModal"><span className="glyphicon glyphicon-log-in" aria-hidden="true"></span> Login</a></li>
                                    <li><a data-toggle="modal" data-target="#RegisterModal"><span className="glyphicon glyphicon-user" aria-hidden="true"></span> Register</a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div className="modal fade" id="LoginModal" tabIndex="-1" role="dialog" aria-labelledby="LoginModalLabel">
                        <div className="modal-dialog modal-sm" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 className="modal-title" id="LoginModalLabel">Login</h4>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <label>Username：</label><input type="text" className="form-control" onChange={this.changeUsername} value={this.state.username}/>
                                        <label>Password：</label><input type="password" className="form-control" onChange={this.changePassword} value={this.state.password}/>
                                    </form>
                                    <br/>
                                    <div>{this.state.errorMessage}</div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={this.login}>Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="RegisterModal" tabIndex="-1" role="dialog" aria-labelledby="LoginModalLabel">
                        <div className="modal-dialog modal-sm" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 className="modal-title" id="RegisterModalLabel">Register</h4>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <label>Username：</label><input type="text" className="form-control"  onChange={this.changeUsername} value={this.state.username}/>
                                        <label>Password：</label><input type="password" className="form-control"  onChange={this.changePassword} value={this.state.password}/>
                                    </form>
                                    <br/>
                                    <div>{this.state.errorMessage}</div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-success" onClick={this.register}>Register</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

module.exports = Navbar;