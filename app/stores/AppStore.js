var Reflux = require('reflux');

var AppStore = Reflux.createStore({
  listenables: [require('../actions/AppActions')],
  init: function() {
    this.firebase = null;
  },
  onLogIn: function(payload) {
    this.trigger('loggedIn');
  },
  onLogOut: function() {
    this.firebase.unauth();
    this.trigger('loggedOut');
  },
  isLoggedIn: function() {
    return this.firebase.getAuth() ? true : false;
  }
});

module.exports = AppStore;