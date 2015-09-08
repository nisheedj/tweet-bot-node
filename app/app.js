var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Firebase = require('firebase');

var Navbar = require('./components/Navbar.react');

var Socket = require('socket.io-client')(window.location.origin);

var AppStore = require('./stores/AppStore');

AppStore.firebase = new Firebase('https://twitter-bot-login.firebaseio.com');
AppStore.io = Socket;

var App = React.createClass({
  componentDidMount: function() {
    AppStore.io.on('connect', function(socket) {
      console.info('Socket Connected !!');
    });
  },
  render () {
    return (
      <div className="container-fluid">
        <Navbar/>
        <div className="container">
          <div className="row">
            <RouteHandler/>
          </div>
        </div>
      </div>
    );
  }
});


var routes = (
  <Route handler={App}>
    <DefaultRoute name="login" handler={require('./pages/Login.react')}/>
    <Route name="add" handler={require('./pages/AddUsers.react')}/>
    <Route name="calibrate" handler={require('./pages/Calibrate.react')}/>
  </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.body);
});