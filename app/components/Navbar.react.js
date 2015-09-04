var React = require('react');
var Router = require('react-router');
var State = Router.State;
var Link = Router.Link;
var Navigation = Router.Navigation;
var Reflux = require('reflux');
var AppStore = require('../stores/AppStore');
var AppActions = require('../actions/AppActions');
var classNames = require('classnames');

var Navbar = React.createClass({
  mixins: [Reflux.ListenerMixin, State, Navigation],
  getInitialState: function() {
    return {
      showLogout: AppStore.isLoggedIn()
    };
  },
  componentDidMount: function() {
    this.listenTo(AppStore, this.checkIsLoggedIn);
  },
  checkIsLoggedIn: function() {
    this.setState({
      showLogout: AppStore.isLoggedIn()
    });
    //Redirect to login page
    if(AppStore.isLoggedIn() === false){
      this.transitionTo('login');
    }
  },
  logoutUser:function(e){
    e.preventDefault();
    AppActions.logOut();
  },
  render: function() {
    
    var logoutClasses = classNames('nav navbar-nav navbar-right', {
      'hidden': !this.state.showLogout
    });

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#tw-bot-navbar-collapse" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="login" className="navbar-brand">Twitter Bot</Link>
          </div>
          <div className="collapse navbar-collapse" id="tw-bot-navbar-collapse">
            {/*Nav Links*/}
            <ul className="nav navbar-nav">
              <li className={classNames({'active':this.isActive('login')})}>
                <Link to="login">Login</Link>
              </li>
              <li className={classNames({'active':this.isActive('add')})}>
                <Link to="add">Add users</Link>
              </li>
              <li className={classNames({'active':this.isActive('progress')})}>
                <Link to="progress">Progress</Link>
              </li>
            </ul>

            {/*Logout link*/}
            <ul className={logoutClasses}>
              <li>
                <a href="" onClick={this.logoutUser}>Logout</a>
              </li>
            </ul>
          </div>  
        </div>
      </nav>
    );
  }

});

module.exports = Navbar;