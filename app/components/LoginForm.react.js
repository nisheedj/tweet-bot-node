var React = require('react');

var LoginForm = React.createClass({
  getDefaultProps: function() {
    return {
      isFormDisabled: false,
      submitCb: function(e) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
  },
  render: function() {
    return (
      <form className="well" onSubmit={this.props.submitCb}>
        <div className="form-group">
          <label htmlFor="userEmail">Email address</label>
          <input disabled={this.props.isFormDisabled} ref={'userName'} type="email" className="form-control" id="userEmail" placeholder="Email" required/>
        </div>
        <div className="form-group">
          <label htmlFor="userPassword">Password</label>
          <input disabled={this.props.isFormDisabled} ref={'userPwd'} type="password" className="form-control" id="userPassword" placeholder="Password" required/>
        </div>
        <div className="form-group text-right">
          <button disabled={this.props.isFormDisabled} type="submit" className="btn btn-primary btn-lg">Login</button>
        </div>
      </form>
    );
  }

});

module.exports = LoginForm;