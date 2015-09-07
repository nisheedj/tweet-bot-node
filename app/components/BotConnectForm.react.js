var React = require('react');

var BotConnectForm = React.createClass({
  getDefaultProps: function() {
    return {
      formDisabled: false,
      toggleConnect: function(e) {
        e.preventDefault();
        e.stopPropagation();
      },
      saveConfigCb: function(e) {}
    };
  },
  render: function() {
    var toggleConnect;
    
    if(this.props.formDisabled === true){
      toggleConnect = <button type="submit" className="btn btn-danger">Disconnect Bot</button>;
    } else {
      toggleConnect = <button type="submit" className="btn btn-success">Connect Bot</button>;
    }

    return (
      <form className="form-inline" onSubmit={this.props.toggleConnect}>
        <div className="form-group">
          <label className="sr-only" htmlFor="botSecretRoom">Secret Bot Room</label>
          <div className="input-group">
            <div className="input-group-addon">BOT</div>
            <input disabled={this.props.formDisabled} ref={'secretRoom'} type="password" className="form-control" id="botSecretRoom" placeholder="Secret"/>
          </div>
        </div>
        &nbsp;
        {toggleConnect}
        &nbsp;
        <button type="button" className="btn btn-default" onClick={this.props.saveConfigCb}>
          <span className="glyphicon glyphicon-floppy-disk"></span>
          &nbsp;Save Config
        </button>
      </form>
    );
  }

});

module.exports = BotConnectForm;