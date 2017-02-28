var React = require('react');
var ReactDOM = require('react-dom');
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var $ = require('jquery');
require('dotenv').load();

class Tweet extends React.Component {
    render() {
        var url = 'https://twitter.com/' + this.props.name;
        return (
            <div>
                <a href={url}><img src={this.props.image} /></a>
                <h3>{this.props.name}</h3>
                <p>{this.props.text}</p>
            </div>
        );
    }
}

class Hash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tweets: [], edit: false, value: this.props.title};
        
        this.handleRemove = this.handleRemove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    
    componentDidMount() {
        this.updateTweets();
    }
    
    updateTweets() {
        $.ajax('/api/tweets/:' + this.state.value.substring(1)).done(function(data) {
            this.setState({tweets: data.statuses});
        }.bind(this));
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        $.ajax({
            url: '/api/edit',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({id: this.props.id, value: this.state.value}),
            success: function(data) {
                console.log('watchlist edited successfully');
                this.props.update();
                this.updateTweets();
                this.setState({edit: false});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    }
    
    handleRemove() {
        $.ajax({
            url: '/api/delete',
            type: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({id: this.props.id}),
            success: function(data) {
                console.log('watchlist deleted successfully');
                this.props.update();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
    
    handleEdit() {
        this.setState({edit: true});
    }
    
    render() {
        var tweets = this.state.tweets.map(function(item, index) {
            return (
                <Tweet 
                    key={index} 
                    name={item.user.screen_name}
                    text={item.text}
                    image={item.user.profile_image_url} 
                />
            );
        });
        
        var title;
        
        if (this.state.edit) {
            //form
            title = (
                <form onSubmit={this.handleSubmit}>
                    <input 
                            type='text' 
                            placeholder='Add a hash tag'
                            pattern='^#\w+'
                            title='hashtag must start with "#" and only alphamuneric'
                            value={this.state.value}
                            onChange={this.handleChange}/>
                </form>    
            );
        } else {
            title = (
                <h1 id='hashtag'>
                    {this.props.title}
                    <button onClick={this.handleEdit}>edit</button>
                    <button onClick={this.handleRemove}>remove</button>
                </h1>
            );
        }
        
        return (
            <Col xs={4}>
                {title}
                {tweets}
            </Col>
        );
    }
}
        
class HashRow extends React.Component {
    render() {
        var update = this.props.update;
        var list = this.props.watchlists.map(function(item, index) {
            return (
                <Hash key={index} title={item.hashtag_title} update={update} id={item._id}/>
            );
        });
        return (
            <Col xs={4 * this.props.watchlists.length}>
                <Grid>
                    <Row>
                        {list}
                    </Row>
                </Grid>
            </Col>
        );
    }
}
        
class AddHash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        var watchlist = this.state;
        $.ajax({
            url: '/api/watchlists',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(watchlist),
            success: function(data) {
                console.log('watchlist added successfully');
                this.props.update();
                this.setState({value: ''});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
    
    render() {
        if (this.props.length < 3) {
            return (
                <Col xs={4}>
                    <form onSubmit={this.handleSubmit}>
                        
                        <input 
                            type='text' 
                            placeholder='Add a hash tag'
                            pattern='^#\w+'
                            title='hashtag must start with "#" and only alphamuneric'
                            value={this.state.value}
                            onChange={this.handleChange}/>
                    </form>
                </Col>
            );
        }
        else return (
            <div></div>
        );
    }
}
    
class Body extends React.Component {
    render() {
        return (
            <Row>
                <HashRow watchlists={this.props.watchlists} update={this.props.update}/>
                
                <AddHash length={this.props.watchlists.length} update={this.props.update}/>
            </Row>
        );
    }
}
        
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: {}};
    }
    
    componentDidMount() {
        $.ajax('/api/currentUser').done(function(data) {
            this.setState({user: data});
        }.bind(this));
    }
    
    render() {
        return (
            <Row>
                <Col xs={8}>
                    <img className='margin' src='/public/img/small_logo.png' />
                </Col>
                <Col xs={4}>
                    <h2>Signed in as: </h2>
                    <h4>{this.state.user.name}</h4>
                    <div className='margin-link'>
                        <a className='logInOut' href='/logout'>Log out</a>
                    </div>
                </Col>
            </Row>
        );
    }
}

class HashTagWatchLists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {watchlists: []};
        this.update = this.update.bind(this);
    }
    
    componentDidMount() {
        $.ajax('/api/user/watchlists').done(function(data) {
            this.setState({watchlists: data});
        }.bind(this));
    }
    
    update() {
        $.ajax('/api/user/watchlists').done(function(data) {
            this.setState({watchlists: data});
        }.bind(this));
    }

    render() {
        return (
            <Grid fluid>
                <Header />
                <Body watchlists={this.state.watchlists} update={this.update}/>
            </Grid>
        );
    }
}

ReactDOM.render(
    <HashTagWatchLists />,
    document.getElementById('root')
);