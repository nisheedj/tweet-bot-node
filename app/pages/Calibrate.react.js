var React = require('react');
var _ = require('underscore');
var Motor = require('../components/Motor.react');
var TimeoutControl = require('../components/TimeoutControl.react');
var Direction = require('../components/Direction.react');

var Calibrate = React.createClass({
  getConfig:function(){
    var config = {};
    _.each(this.refs, function(ref, key) {
      if (ref.hasOwnProperty('slider')) {
        config[key] = ref.slider.getValue();
      }
    });
    return config;
  },
  saveConfig:function(){
    console.log(this.getConfig());
  },
  render: function() {
    return (
      <div className="col-sm-12 margin-top">
        <div className="text-right">
          <button className="btn btn-success" onClick={this.saveConfig}>
            Connect Bot
          </button>
          &nbsp;
          <button className="btn btn-default" onClick={this.saveConfig}>
            <span className="glyphicon glyphicon-floppy-disk"></span>
            &nbsp;Save Config
           </button>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <div className="row">
              <Motor ref={'motorAFwd'} name="Motor A forward speed" id="motorAFwd"/>
              <Motor ref={'motorARev'} name="Motor A reverse speed" id="motorARev"/>
              <Motor ref={'motorBFwd'} name="Motor B forward speed" id="motorBFwd"/>
              <Motor ref={'motorBRev'} name="Motor B reverse speed" id="motorBRev"/>
            </div>
            <div className="row">
              <TimeoutControl ref={'timeoutFwdRev'} name="Forward Reverse Timeout" id="timeoutFwdRev"/>
              <TimeoutControl ref={'timeoutLtRt'} name="Left Right Timeout" id="timeoutLtRt"/>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div className="row">
              <Direction/>
            </div>  
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Calibrate;