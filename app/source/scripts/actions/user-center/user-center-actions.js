'use strict';

var Reflux = require('reflux');

var UserCenterActions = Reflux.createActions([
  'loadUserDetail',
  'updateUserDetail',
  'changeState',
  'changeGender',
  'validateGender',
  'changeBirthday',
  'checkGender',
  'checkBirthday',
  'loadResult'
]);

module.exports = UserCenterActions;
