var React = require('react');

var AddUserForm = React.createClass({
  getDefaultProps: function() {
    return {
      submitCb:function(e){
        e.preventDefault();
        e.stopPropagation();
      }
    };
  },
  render: function() {
    var userInputs = [];
    for (var i = 0; i < 4; i++) {
      userInputs.push(
        <div className="form-group" key={i}>
          <label className="sr-only" htmlFor={'user' + (i + 1)}>{'user' + (i + 1)}</label>
          <div className="input-group">
            <div className="input-group-addon">{'User ' + (i + 1)}</div>
            <input ref={'user' + (i + 1)} type="text" className="form-control" id={'user' + (i + 1)} placeholder="@user"/>
          </div>    
        </div>
      );
    }
    return (
      <form className="well" onSubmit={this.props.submitCb}>
        {userInputs}
        <div className="form-group text-right">
          <button type="submit" className="btn btn-primary btn-lg">Add Users</button>
        </div>
      </form>
    );
  }

});

module.exports = AddUserForm;