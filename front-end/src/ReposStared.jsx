import React from 'react'
import Repo from './Repo.jsx'
/**
 * A class maintain a list of Repos
 */

class ReposStared extends React.Component{
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.state = {
            repoCounter: 0,
            repoItems: [],
        };
        this.refresh();
    }

    refresh(){
        $.post("./api/querystar.php",
            {},
            function(data, status){
                if (status){
                    let result = JSON.parse(data);
                    if (result["state"] == "0"){
                        this.setState({
                            repoItems: result["info"],
                            repoICounters: result.length
                        });
                    }
                }
            }.bind(this)
        );
    }
    
    render(){
        var repoItems = this.state.repoItems;
        return (
            <div className="panel panel-warning">
                <div className="panel-heading">Star
                    <a href="#!" onClick={this.refresh}>
                        Refresh
                    </a></div>
                <div className="panel-body">
                    <div className="row">
                        <div hidden="hidden">{this.state.repoCounter}</div>
                        {
                            repoItems.map(function (repo) {
                                return <Repo key={repo.id}
                                            repoid={repo.id} 
                                            reponame={repo.name} 
                                            repodesc={repo.description} 
                                            repowatcher={repo.watchers} 
                                            repostar={repo.star}
                                            reposearched={false}
                                            reporefresh = {this.refresh.bind(this)} />
                            }.bind(this))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = ReposStared;