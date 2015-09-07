var React = require('react');

var Direction = React.createClass({
  getDefaultProps: function() {
    return {
      fwd: function() {},
      lt: function() {},
      rt: function() {},
      rev: function() {},
      br: function() {}
    };
  },
  render: function() {
    return (
      <div className="col-md-12">
        <h3>Direction Control</h3>
        <hr/>
        <table className="motor-control">
          <tbody>
            <tr>
              <td colSpan="3" className="text-center">
                <button className="btn btn-lg btn-primary" onMouseDown={this.props.fwd}>
                  <span className="glyphicon glyphicon-arrow-up"></span>
                </button>
              </td>
            </tr>
            <tr>
              <td className="text-center">
                <button className="btn btn-lg btn-primary" onMouseDown={this.props.lt}>
                  <span className="glyphicon glyphicon-arrow-left"></span>
                </button>
              </td>
              <td className="text-center">
                <button className="btn btn-lg btn-primary" onMouseDown={this.props.br}>
                  <span className="glyphicon glyphicon-stop"></span>
                </button>
              </td>
              <td className="text-center">
                <button className="btn btn-lg btn-primary" onMouseDown={this.props.rt}>
                  <span className="glyphicon glyphicon-arrow-right"></span>
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan="3" className="text-center">
                <button className="btn btn-lg btn-primary" onMouseDown={this.props.rev}>
                  <span className="glyphicon glyphicon-arrow-down"></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

});

module.exports = Direction;