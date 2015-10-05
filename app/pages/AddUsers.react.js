var React = require('react');
var _ = require('underscore');
var Navigation = require('react-router').Navigation;
var AppStore = require('../stores/AppStore');
var AddUserForm = require('../components/AddUserForm.react');
var LoginRedirect = require('../mixins/LoginRedirect');

var AddUsers = React.createClass({
  mixins: [LoginRedirect, Navigation],
  getInitialState: function() {
    return {
      formDisabled: false,
      activeUsers: []
    };
  },
  startGame: function(data) {
    AppStore.io.emit('start game', data);
    this.setState({
      formDisabled: true
    });
  },
  stopGame: function() {
    AppStore.io.emit('stop game');
    this.setState({
      formDisabled: false
    });
  },
  addUsers: function(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.formDisabled === false) {

      var userInputRefs = this.refs.addUsersForm.refs;
      var userNames = [];

      _.each(userInputRefs, function(userInputRef) {
        var userInput = React.findDOMNode(userInputRef);
        if (userInput.value) {
          var userName = userInput.value.replace(/\W?/g, '');
          if (userName !== '') {
            userNames.push(userName);
          }
        }
      });
      //Send data to the backend
      this.startGame(userNames);
    } else {
      this.stopGame();
    }
  },
  activeGameUsersCb: function(data) {
    if (data.length) {
      if (this.isMounted()) {
        this.setState({
          formDisabled: true,
          activeUsers: data
        });
      }
    }
  },
  componentWillMount: function() {
    AppStore.io.on('active game users', this.activeGameUsersCb);
  },
  componentDidMount: function() {
    AppStore.io.emit('get active game users');
  },
  componentWillUnmount: function() {
    AppStore.io.removeListener('active game users', this.activeGameUsersCb);
  },
  render: function() {
    return (
      <div className="col-sm-12 col-md-6 col-md-offset-3 margin-top">
          <h2>Add Users</h2>
          <hr/>
          <AddUserForm ref={'addUsersForm'} submitCb={this.addUsers} {...this.state}/>
       </div>
    );
  }

});

module.exports = AddUsers;
