var AppStore = require('../stores/AppStore');

var LoginRedirect = {
  statics: {
    willTransitionTo: function(transition, params, query, callback) {
      if (!AppStore.isLoggedIn()) {
        transition.redirect('login');
        callback();
      } else {
        callback();
      }
    },
    willTransitionFrom: function (transition, component) {
      if (transition.path === '/' && AppStore.isLoggedIn()) {
        transition.abort();
      }
    }
  }
};

module.exports = LoginRedirect;