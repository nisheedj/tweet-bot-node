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
            <input disabled={this.props.formDisabled} ref={'user' + (i + 1)} type="text" className="form-control" id={'user' + (i + 1)} placeholder="@user" value={this.props.activeUsers[i]} onChange={()=>{}}/>
          </div>    
        </div>
      );
    }
    var formBtn;
    if(this.props.formDisabled){
      formBtn = <button type="submit" className="btn btn-danger btn-lg">Stop Game</button>;
    } else {
      formBtn = <button type="submit" className="btn btn-primary btn-lg">Start Game</button>;
    }
    return (
      <form className="well" onSubmit={this.props.submitCb}>
        {userInputs}
        <div className="form-group text-right">
          {formBtn}
        </div>
      </form>
    );
  }

});

module.exports = AddUserForm;