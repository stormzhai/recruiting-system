'use strict';

var Reflux = require('reflux');

var HomeworkActions = Reflux.createActions([
  'changeOrderId',
  'loadHomeworkList',
  'getRunningResult',
  'submitUrl',
  'submited',
  'getBranches',
  'changeGithubUrl',
  'reload'
]);

module.exports = HomeworkActions;