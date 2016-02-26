'use strict';

var Reflux = require('reflux');

var LoginActions = Reflux.createActions([
  'login',
  'changeState',
  'changeValue'
]);

module.exports = LoginActions;
