'use strict';

var Reflux = require('reflux');

var LoginActions = Reflux.createActions([
  'login',
  'changeState'
]);

module.exports = LoginActions;
