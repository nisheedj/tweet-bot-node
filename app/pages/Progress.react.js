var React = require('react');
var AppStore = require('../stores/AppStore');
var LoginRedirect = require('../mixins/LoginRedirect');

var Progress = React.createClass({
  mixins: [LoginRedirect],
  render: function() {
    return (
      <div className="col-sm-12 col-md-6 col-md-offset-3 margin-top">
        <h2>Progress</h2>
        <hr/>
        <div className="well">
          <code>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          </code>
        </div>
      </div>
    );
  }

});

module.exports = Progress;