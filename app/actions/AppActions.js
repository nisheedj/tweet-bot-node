var Reflux = require('reflux');

var AppActions = Reflux.createActions([
  'logIn',
  'logOut'
]);

module.exports = AppActions;