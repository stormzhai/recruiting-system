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
          var status;
          if(res.body.isOverTime){
            status = 'overTime';
            if(res.body.isLast){
              status = 'isFinished';
            }
          }
          this.trigger({
            puzzleEnabled: res.body.isPaperCommited ? false : true,
            homeworkEnabled: res.body.isPaperCommited,
            isOverTime: res.body.isOverTime,
            isFinished: res.body.isFinished,
            status: status
          });
        });
  }

});

module.exports = DashboardStore;
