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
            repoItems: []
        };
    }

    refresh(token){
        $.post("./api/querystar.php",
            {
                token: token
            },
            function(data, status){
                if (status){
                    let result = JSON.parse(data);
                    if (result["state"] == "0"){
                        this.setState({
                            repoItems: result["info"],
                            repoICounters: result.length
                        });
                        this.props.afterStarRefreshed();
                    }
                }
            }.bind(this)
        );
    }

    componentWillReceiveProps(nextProps){
        if (this.props.refresh == false && nextProps.refresh == true){
            this.refresh(this.props.token);
        }
        if (this.props.isLogin == false && nextProps.isLogin == true){
            this.refresh(nextProps.token);
        }
    }
    
    render(){
        var repoItems = this.state.repoItems;
        return (
            <div className="panel panel-warning">
                <div className="panel-heading">Stared Repos</div>
                <div className="panel-body">
                    <div className="row">
                        <div hidden="hidden">{this.state.repoCounter}</div>
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
        );
    }
}

module.exports = ReposStared;