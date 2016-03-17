'use strict';

var Reflux = require('reflux');
var HomeworkActions = require('../../actions/homework/homework-actions');
var superAgent = require('superagent');
var errorHandler = require('../../../../tools/error-handler');

var RunningResultStore = Reflux.createStore({
  listenables: [HomeworkActions],

  onSubmitUrl: function () {
    this.trigger({
      resultText: '',
      isSubmited: true
    });
  },

  onChangeOrderId: function (Number) {
    superAgent.get('homework/get-result')
        .set('Content-Type', 'application/json')
        .query({orderId: Number})
        .use(errorHandler)
        .end((err,res) => {
          this.trigger({
            isSubmited: res.body.isSubmited,
            resultText: res.body.resultText
          });
        });
  },

  onReload: function (orderId) {
    this.onChangeOrderId(orderId);
  }
});

module.exports = RunningResultStore;
