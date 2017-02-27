var React = require('react');
var ReactDOM = require('react-dom');

// static first.
var watchlists = [
            {hashtag_title: '#cats'},
            {hashtag_title: '#dogs'},
            {hashtag_title: '#birds'}
        ];
        
class Hash extends React.Component {
    render() {
        return (
            <div></div>
        );
    }
}
        
class AddHash extends React.Component {
    render() {
        return (
            <div></div>
        );
    }
}
    
class Body extends React.Component {
    render() {
        return (
            <div>
                <Hash />
                <AddHash />
            </div>
        );
    }
}
        
class Header extends React.Component {
    render() {
        return (
            <div>
                <img src='/public/img/small_logo.png' />
                <h2>Signed in as: </h2>
                <h4>Isaias M. Pomales</h4>
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
                <Body />
            </div>
        );
    }
}

ReactDOM.render(
    <HashTagWatchLists />,
    document.getElementById('root')
);