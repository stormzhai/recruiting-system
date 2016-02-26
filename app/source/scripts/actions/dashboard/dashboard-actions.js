'use strict';

var Reflux = require('reflux');

var DashboardActions = Reflux.createActions([
  'getStatus',
  'showPrompt',
  'hidePrompt'
]);

module.exports = DashboardActions;
