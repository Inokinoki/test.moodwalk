import React from 'react'
import Repo from './Repo.jsx'
/**
 * A class maintain a list of Repos
 */

class ReposStared extends React.Component{

    constructor(props) {
        super(props);
        this.flow = this.flow.bind(this);
        this.search = this.search.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.state = {
            repoCounter: 0,
            repoItems: [],
            repoUser: "",
            init: true,
            userexist: false,
            avatar: "./res/img/github.png",
            hidden: "none"
        };
    }

    changeUser(event){
        this.setState({repoUser: event.target.value});
    }

    flow(){
        // Get Avatar link
        if (this.state.repoUser.length > 0 && this.props.isLogin == true){
            $.post("./api/queryavatar.php",
                {
                    user : this.state.repoUser,
                    token : this.props.token
                }, 
                function(data, status){
                    if (status){
                        let result = JSON.parse(data);
                        if (result["state"] == "0"){
                            this.setState({
                                avatar: result["info"],
                                userexist: true
                            });
                            this.search();
                        }
                    }
                }.bind(this)
            );
        }
    }

    search(){
        if (this.state.repoUser.length > 0 && 
            this.state.userexist == true && 
            this.props.isLogin == true){
            $.post("./api/query.php",
                {
                    user : this.state.repoUser,
                    token : this.props.token
                }, 
                function(data, status){
                    if (status){
                        let result = JSON.parse(data);
                        if (result["state"] == "0"){
                            this.setState({
                                repoItems: result["info"],
                                repoCounter: result['info'].length,
                                repoUser: name,
                                init: false
                            });
                        }
                    }
                }.bind(this)
            );
        }
    }
    
    render(){
        let question;
        if (this.props.isLogin == true)
            question = "So, If you have already logged in, Which one do you want to hack ?";
        else
            question = "I'm sorry but the first thing you have to do is logging in";

        var repoItems = this.state.repoItems;
        return (
            <div className="panel panel-success">
                <div className="panel-heading">Stared Repos</div>
                <div className="panel-body">
                    <div className="row">
                        <div className="repos-searched container">
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                                    <div id="talkbubble-top" className="hidden-sm hidden-md hidden-lg">
                                        <p>{this.state.question}</p>
                                    </div>
                                    <img src={this.state.avatar} alt="Github Repos Displayer"></img>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-5">
                                    <div id="talkbubble-right" className="hidden-xs">
                                        <p>{question}</p>
                                    </div>
                                </div>
                                <div className="input-group col-xs-10 col-sm-8 col-md-6 col-lg-6">
                                    <span className="input-group-addon">Github User</span>
                                    <input type="text" id="input-search-username" onChange={this.changeUser}
                                        className="form-control" value={this.state.repoUser}/>
                                    <span className="input-group-btn">
                                        <button className="btn btn-default" type="button" 
                                            onClick={this.flow}>Hack It!</button>
                                    </span>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                {this.state.init == false ? 
                                    "Repo Count: " + this.state.repoCounter :" "}
                                </div>
                            </div>
                            <div className="row">
                                {
                                    repoItems.map(function (repo) {
                                        return <Repo key={repo.id}
                                                    isLogin={this.props.isLogin}
                                                    token={this.props.token}
                                                    repoid={repo.id} 
                                                    reponame={repo.name} 
                                                    repodesc={repo.description} 
                                                    repowatcher={repo.watchers} 
                                                    repostar={repo.star}
                                                    reporefresh = {this.props.afterStarChanged} />
                                    }.bind(this))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = ReposStared;