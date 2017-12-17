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
            avatar: ""
        };
    }

    changeUser(event){
        this.setState({repoUser: event.target.value});
    }

    flow(){
        // Get Avatar link
        if (this.state.repoUser.length > 0){
            $.post("./api/queryavatar.php",
                {
                    user : this.state.repoUser
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
        if (this.state.repoUser.length > 0 && this.state.userexist == true){
            $.post("./api/query.php",
                {
                    user : this.state.repoUser
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

    refresh(){
        // Nothing to do
    }
    
    render(){
        var repoItems = this.state.repoItems;
        return (
            <div className="repos-searched container">
                <div className="row">
                    <div className="input-group col-xs-10 col-sm-8 col-md-6 col-lg-6">
                        <span className="input-group-addon">Github User</span>
                        <input type="text" id="input-search-username" onChange={this.changeUser}
                            className="form-control" value={this.state.repoUser}/>
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="button" 
                                onClick={this.flow}>Hack It!</button>
                        </span>
                    </div>
                    <div className="input-group col-xs-10 col-sm-8 col-md-6 col-lg-6">
                        <img hidden={this.state.init == true? "hidden":""} 
                            src={this.state.avatar}></img>
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
                                        repoid={repo.id} 
                                        reponame={repo.name} 
                                        repodesc={repo.description} 
                                        repowatcher={repo.watchers} 
                                        repostar={repo.star}
                                        reposearched={true}
                                        reporefresh = {this.refresh.bind(this)} />
                        }.bind(this))
                    }
                </div>
            </div>
        );
    }
}

module.exports = ReposStared;