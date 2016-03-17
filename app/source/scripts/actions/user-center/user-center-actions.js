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
  'checkBirthday'
]);

module.exports = UserCenterActions;
