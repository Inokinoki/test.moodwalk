import React from 'react'

/**
 * A class maintain a repo
 */

class Repo extends React.Component{

    constructor(props) {
        super(props);
        this.star = this.star.bind(this);
        this.unstar = this.unstar.bind(this);
        this.state = {
            isStared: props.repostar == 1 ? true : false,
            display: true
        };
    }

    star(){
        if (this.props.isLogin == true){
            $.post("./api/addstar.php",
                {
                    id: this.props.repoid,
                    token: this.props.token
                },
                function (data, status){
                    if (status){
                        let result = JSON.parse(data);
                        if (result["state"] == "0"){
                            // Star OK
                            this.setState({isStared: true});
                            this.props.reporefresh();
                        }
                    }
                }.bind(this)
            );
        }
    }
    
    unstar(){
        if (this.props.isLogin == true){
            $.post("./api/unstar.php",
                {
                    id: this.props.repoid,
                    token: this.props.token
                },
                function (data, status){
                    if (status){
                        let result = JSON.parse(data);
                        if (result["state"] == "0"){
                            // Unstar OK
                            this.setState({isStared: false});
                            this.props.reporefresh();
                        }
                    }
                }.bind(this)
            );
        }
    }

    render(){
        if (this.state.isStared == true){
            // Stared repo
            return (
                <div className="col-xs-10 col-sm-9 col-md-8 col-lg-7">
                    <h3>{ this.props.reponame }
                        <a onClick={this.unstar} href="#!">
                            <span className="glyphicon glyphicon-star"></span>
                        </a>
                    </h3>
                    <p>Github ID: { this.props.repoid }</p>
                    <p>Description: { this.props.repodesc }</p>
                    <p>Watchers Count: { this.props.repowatcher }</p>
                </div>
            );
        } else {
            // Unstared repo
            return (
                <div className="col-xs-10 col-sm-9 col-md-8 col-lg-7">
                    <h3>{ this.props.reponame } 
                        <a onClick={this.star} href="#!">
                            <span className="glyphicon glyphicon-star-empty"></span>
                        </a>
                    </h3>
                    <p>Github ID: { this.props.repoid }</p>
                    <p>Description: { this.props.repodesc }</p>
                    <p>Watchers Count: { this.props.repowatcher }</p>
                </div>
            );
        }
    }
}

module.exports =  Repo;