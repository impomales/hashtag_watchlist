var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Redirect = require('react-router').Redirect;

class NoMatch extends React.Component {
    render() {
        return (
            <h2>ERROR: NO MATCH FOUND FOR THIS ROUTE</h2>
        );
    }
}

ReactDOM.render(
    <NoMatch />,
    document.getElementById('root')
);