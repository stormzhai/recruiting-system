'use strict';

var Reflux = require('reflux');
var TimerActions = require('../../actions/logic-puzzle/timer-actions');
var superAgent = require('superagent');
var errorHandler = require('../../../../tools/error-handler.jsx');


var TimerStore = Reflux.createStore({
  listenables: [TimerActions],

  onGetRemainTime: function () {
    superAgent
        .get('/timer/remain-time')
        .set('Content-Type', 'application/json')
        .use(errorHandler)
        .end((err, res) => {
          this.trigger({
            'remainTime': res.body.remainTime
          });
        });
  }
});

module.exports = TimerStore;
