'use strict';

var Reflux = require('reflux');
var DashboardActions = require('../../actions/dashboard/dashboard-actions');
var request = require('superagent');
var errorHandler = require('../../../../tools/error-handler.jsx');

var DashboardStore = Reflux.createStore({
  listenables: DashboardActions,

  onGetStatus: function () {
    request.get('/dashboard')
        .set('Content-Type', 'application/json')
        .use(errorHandler)
        .end((err, res) => {
          var puzzleEnabled = res.body.isPaperCommited ? false : true;
          if (!puzzleEnabled) {
            this.submitPaper();
          }
          this.trigger({
            puzzleEnabled: puzzleEnabled,
            homeworkEnabled: res.body.isPaperCommited,
            isOverTime: res.body.isOverTime,
            isFinished: res.body.isFinished
          });
        });
  },

  submitPaper: function () {
    request.post('/logic-puzzle')
        .set('Content_Type', 'application/json')
        .use(errorHandler)
        .end();
  }

});

module.exports = DashboardStore;
