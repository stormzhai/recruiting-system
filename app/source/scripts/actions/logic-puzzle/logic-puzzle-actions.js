'use strict';

var Reflux = require('reflux');

var LogicPuzzleActions = Reflux.createActions([
  'loadItem',
  'submitAnswer',
  'saveUserAnswer',
  'changeAnswer',
  'submitPaper',
  'timeOver'
]);

module.exports = LogicPuzzleActions;
