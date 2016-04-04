'use strict';

var Reflux = require('reflux');

var HomeworkActions = Reflux.createActions([
  'init',
  'changeOrderId',
  'createTask',
  
  'loadHomeworkList',
  'getRunningResult',
  'submitUrl',
  'submited',
  'getBranches',
  'changeGithubUrl',
  'reload'
]);

module.exports = HomeworkActions;
