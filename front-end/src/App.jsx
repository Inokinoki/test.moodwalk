import React from 'react'

import Navbar from './Navbar.jsx'
import ReposSearched from './ReposSearched.jsx'
import ReposStared from './ReposStared.jsx'


/**
 * App
 */

 class App extends React.Component{
    constructor(props){
        super(props);

        this.afterLogin = this.afterLogin.bind(this);
        this.afterLogout = this.afterLogout.bind(this);
        this.afterStarChanged = this.afterStarChanged.bind(this);
        this.afterStarRefreshed = this.afterStarRefreshed.bind(this);

        this.state = {
            isLogin: false,
            username: "",
            token: "",
            refreshStar: false
        };
    }

    afterLogin(token, username){
        this.setState({
            isLogin: true,
            token: token,
            username: username,
        });
    }

    afterLogout(){
        this.setState({
            isLogin: false,
            token: "",
            username: "",
        });
    }

    afterStarChanged(){
        this.setState({refreshStar: true});
    }

    afterStarRefreshed(){
        this.setState({refreshStar: false});
    }

    render(){
        return (
            <div>
                <Navbar isLogin={this.state.isLogin} 
                        username={this.state.username} 
                        token={this.state.token}
                        afterLoginAction={this.afterLogin}
                        afterLogoutAction={this.afterLogout} />
                <div className="container">
                    <ReposSearched 
                        isLogin={this.state.isLogin} 
                        token={this.state.token}
                        afterStarChanged={this.afterStarChanged} />
                    <ReposStared 
                        token={this.state.token}
                        isLogin={this.state.isLogin} 
                        refresh={this.state.refreshStar} 
                        afterStarChanged={this.afterStarChanged}
                        afterStarRefreshed={this.afterStarRefreshed} />
                </div>
            </div>
        );

    }

}

module.exports = App;