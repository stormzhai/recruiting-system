'use strict';

var Reflux = require('reflux');
var DashboardActions = require('../../actions/dashboard/dashboard-actions');
var request = require('superagent');
var errorHandler = require('../../../../tools/error-handler');

var DashboardStore = Reflux.createStore({
  listenables: DashboardActions,

  onGetStatus: function () {
    request.get('/dashboard')
        .set('Content-Type', 'application/json')
        .use(errorHandler)
        .end((err, res) => {
          this.trigger({
            puzzleEnabled: res.body.isPaperCommited ? false : true,
            homeworkEnabled: res.body.isPaperCommited
          });
        });
  },

  onShowPrompt: function (puzzleEnabled, homeworkEnabled, event) {
    var iconName = event.target.parentNode.getAttribute('name');
    if (iconName === 'logic' && puzzleEnabled === false) {
      this.trigger({
        isTip: true,
        tipContent: '您的逻辑题已经完成'
      });
    }

    if (iconName === 'homework' && homeworkEnabled === false) {
      this.trigger({
        isTip: true,
        tipContent: puzzleEnabled === true ? '请先完成逻辑题' : '您的编程题已完成'
      });
    }

  },

  onHidePrompt: function () {
    this.trigger({
      isTip: false
    });
  }

});

module.exports = DashboardStore;
