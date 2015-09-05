var React = require('react');
var _ = require('underscore');
var Navigation = require('react-router').Navigation;
var AppStore = require('../stores/AppStore');
var AddUserForm = require('../components/AddUserForm.react');
var LoginRedirect = require('../mixins/LoginRedirect');

var AddUsers = React.createClass({
  mixins: [LoginRedirect, Navigation],
  addUsers:function(e){
    e.preventDefault();
    e.stopPropagation();
    var userInputRefs = this.refs.addUsersForm.refs;
    var userNames = [];
    
    _.each(userInputRefs,function(userInputRef){
      if(userInputRef.getDOMNode().value){
        var userName = userInputRef.getDOMNode().value.replace(/\W?/g,'');
        userNames.push(userName);
      }
    });

    if(userNames.length){
      //Send data to the backend
      this.transitionTo('progress');
    }

  },
  render: function() {
    return (
       <div className="col-sm-12 col-md-6 col-md-offset-3 margin-top">
          <h2>Add Users</h2>
          <hr/>
          <AddUserForm ref={'addUsersForm'} submitCb={this.addUsers}/>
       </div>
    );
  }

});

module.exports = AddUsers;