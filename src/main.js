var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

// static first.
var watchlists = [
            {hashtag_title: '#cats'},
            {hashtag_title: '#dogs'},
            {hashtag_title: '#birds'}
        ];
        
class Hash extends React.Component {
    render() {
        return (
            <td>
                <h1>{this.props.title}</h1>
                <p>recent tweets</p>
            </td>
        );
    }
}
        
class HashRow extends React.Component {
    render() {
        var list = this.props.watchlists.map(function(item, index) {
            return (
                <Hash key={index} title={item.hashtag_title}/>
            );
        });
        return (
            <div>
                <table>
                    <tbody>
                        <tr>{list}</tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
        
class AddHash extends React.Component {
    render() {
        if (this.props.length < 3) {
            return (
                <div>
                    <form>
                        <input type='text' placeholder='Add a hash tag' />
                    </form>
                </div>
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
            <div>
                <HashRow watchlists={this.props.watchlists}/>
                <AddHash length={this.props.watchlists.length}/>
            </div>
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
            <div>
                <img src='/public/img/small_logo.png' />
                <h2>Signed in as: </h2>
                <h4>{this.state.user.name}</h4>
                <a id='logInOut' href='/logout'>Log out</a>
            </div>
        );
    }
}

class HashTagWatchLists extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <Body watchlists={this.props.watchlists}/>
            </div>
        );
    }
}

ReactDOM.render(
    <HashTagWatchLists watchlists={watchlists}/>,
    document.getElementById('root')
);