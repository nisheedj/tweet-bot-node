var React = require('react');
var Navigation = require('react-router').Navigation;
var classNames = require('classnames');
var LoginForm = require('../components/LoginForm.react');
var AppStore = require('../stores/AppStore');
var AppActions = require('../actions/AppActions');

var Login = React.createClass({
  mixins:[Navigation],
  statics: {
    willTransitionTo: function(transition, params, query, callback) {
      if (AppStore.isLoggedIn()) {
        transition.redirect('add');
        callback();
      } else {
        callback();
      }
    }
  },
  getInitialState: function() {
    return {
      disableForm: false,
      loginError: false,
      errorMsg:''
    };
  },
  authHandler: function(error, authData) {
    if (error) {
      //https://www.firebase.com/docs/web/guide/user-auth.html#section-handling-errors
      this.setState({
        disableForm: false,
        loginError: true,
        errorMsg: error.message
      });
    } else {
      //https://www.firebase.com/docs/web/guide/login/password.html#section-logging-in
      AppActions.logIn();
      //Redirect user to add users page.
      this.transitionTo('add');
    }
  },
  loginUser: function(e) {
    e.preventDefault();
    e.stopPropagation();

    //disable the form while loging in
    this.setState({
      disableForm: true,
      loginError: false,
      errorMsg: ''
    });

    AppStore.firebase.authWithPassword({
      email: this.refs.loginForm.refs.userName.getDOMNode().value,
      password: this.refs.loginForm.refs.userPwd.getDOMNode().value
    }, this.authHandler);
  },
  render: function() {
    
    var errorClasses = classNames('alert alert-danger',{
      'hidden':!this.state.loginError
    });

    return (
      <div className="col-sm-12 col-md-6 col-md-offset-3 margin-top">
        <h2>Login</h2>
        <hr/>
        <LoginForm ref={'loginForm'} isFormDisabled={this.state.disableForm} submitCb={this.loginUser}/>
        {/* Error Notification */}
        <div className={errorClasses} role="alert">
          <strong>Error: </strong>
          {this.state.errorMsg}
        </div>
      </div>
    );
  }

});

module.exports = Login;