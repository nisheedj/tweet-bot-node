var React = require('react');
var _ = require('underscore');
var Firebase = require('firebase');
var Motor = require('../components/Motor.react');
var TimeoutControl = require('../components/TimeoutControl.react');
var Direction = require('../components/Direction.react');
var BotConnectForm = require('../components/BotConnectForm.react');
var LoginRedirect = require('../mixins/LoginRedirect');

var AppStore = require('../stores/AppStore');

var firebaseRef = new Firebase('https://twitter-bot-login.firebaseio.com/motorConfig');

var Calibrate = React.createClass({
  statics:{
    willTransitionTo: function(transition, params, query, callback) {
      if (!AppStore.isLoggedIn()) {
        transition.redirect('login');
        callback();
      } else {
        /*Get data from firebase*/
        firebaseRef.on("value", function(snapshot) {
          AppStore.motorConfig = snapshot.val();
          callback();
        }, function(errorObject) {
          alert("The read failed: " + errorObject.code);
          callback();
        });
      }
    }
  },
  getInitialState: function() {
    return {
      toggleConnect: false
    };
  },
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
    var currentConfig = this.getConfig();
    firebaseRef.update(currentConfig,function(error){
      if(error){
        console.error('The data could not be saved ' + error);
        return;
      }
      console.info('Data saved successfully');
    });
  },
  connectBot:function(e){
    e.preventDefault();
    e.stopPropagation();

    if(this.state.toggleConnect){
      AppStore.io.emit('leave secret room');
      return;
    }

    var currentConfig = this.getConfig();
    var roomValue = this.refs.botConnectForm.refs.secretRoom.getDOMNode().value;

    AppStore.io.emit('join secret room', {
      room: roomValue,
      config: currentConfig
    });
  },
  componentDidMount: function() {
    var self = this;

    AppStore.io.on('disconnect',function(){
      console.info('Client disconnected !!');
      if(self.isMounted()){ 
        self.setState({
          toggleConnect: false
        });
      }
    });

    AppStore.io.on('joined secret room', function(data) {
      console.info('Joined bot room !!');
      if (self.isMounted()) {
        self.setState({
          toggleConnect: true
        });
      }
    });

    AppStore.io.on('left secret room', function() {
      console.info('Left bot room !!');
      if (self.isMounted()) {
        self.setState({
          toggleConnect: false
        });
      }
    });

    AppStore.io.on('error joining room', function(data) {
      console.error('Error joining bot room !!');
      if (self.isMounted()) {
        self.setState({
          toggleConnect: false
        });
      }
    });

    AppStore.io.on('admin already connected', function() {
      console.error('Admin already connected to bot room !!');
      if (self.isMounted()) {
        self.setState({
          toggleConnect: false
        });
      }
    });

  },
  directionControl:function(action){
    AppStore.io.emit('move twitter bot',action);
  },
  forwardDirectionCtrl:function(e){
    this.directionControl('forward');
  },
  reverseDirectionCtrl:function(e){
    this.directionControl('reverse');
  },
  rightDirectionCtrl:function(e){
    this.directionControl('right');
  },
  leftDirectionCtrl:function(e){
    this.directionControl('left');
  },
  stopDirectionCtrl:function(e){
    this.directionControl('stop');
  },
  render: function() {
    return (
      <div className="col-sm-12 margin-top">
        
        <div className="row">
          <div className="col-sm-12">
            <BotConnectForm ref={'botConnectForm'} formDisabled={this.state.toggleConnect} toggleConnect={this.connectBot} saveConfigCb={this.saveConfig}/>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 col-md-6">
            
            <div className="row">
              <Motor isDisabled={this.state.toggleConnect} ref={'motorAFwd'} name="Motor A forward speed" id="motorAFwd" value={AppStore.motorConfig.motorAFwd}/>
              <Motor isDisabled={this.state.toggleConnect} ref={'motorARev'} name="Motor A reverse speed" id="motorARev" value={AppStore.motorConfig.motorARev}/>
              <Motor isDisabled={this.state.toggleConnect} ref={'motorBFwd'} name="Motor B forward speed" id="motorBFwd" value={AppStore.motorConfig.motorBFwd}/>
              <Motor isDisabled={this.state.toggleConnect} ref={'motorBRev'} name="Motor B reverse speed" id="motorBRev" value={AppStore.motorConfig.motorBRev}/>
            </div>

            <div className="row"> 
              <TimeoutControl isDisabled={this.state.toggleConnect} ref={'timeoutFwdRev'} name="Forward Reverse Timeout" id="timeoutFwdRev" value={AppStore.motorConfig.timeoutFwdRev}/>
              <TimeoutControl isDisabled={this.state.toggleConnect} ref={'timeoutLtRt'} name="Left Right Timeout" id="timeoutLtRt" value={AppStore.motorConfig.timeoutLtRt}/>
            </div>
          
          </div>
          <div className="col-sm-12 col-md-6">
            
            <div className="row">
              <Direction fwd={this.forwardDirectionCtrl} rev={this.reverseDirectionCtrl} lt={this.leftDirectionCtrl} rt={this.rightDirectionCtrl} br={this.stopDirectionCtrl}/>
            </div>  
          
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Calibrate;