'use strict';

var Reflux = require('reflux');

var UserCenterActions = Reflux.createActions([
  'loadUserDetail',
  'updateUserDetail',
  'changePassword',
  'changeState',
  'changeGender',
  'validateGender'
]);

module.exports = UserCenterActions;
