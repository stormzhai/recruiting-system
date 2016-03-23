'use strict';

var Reflux = require('reflux');
var HomeworkActions = require('../../actions/homework/homework-actions');
var request = require('superagent');
var constant = require('../../../../mixin/constant');
var homeworkQuizzesStatus = require('../../../../mixin/constant').homeworkQuizzesStatus;
var errorHandler = require('../../../../tools/error-handler');

var HomeworkIntroductionStore = Reflux.createStore({
  listenables: [HomeworkActions],

  onChangeOrderId: function (orderId) {
    request.get('homework/quiz')
        .set('Content-Type', 'application/json')
        .query({orderId: orderId})
        .use(errorHandler)
        .end((err, res) => {
          if (res.body.status === constant.httpCode.FORBIDDEN) {
            this.trigger({
              desc: '## 当前题目处于锁定状态!',
              quizStatus: homeworkQuizzesStatus.LOCKED,
              showRepo: false
            });
          } else if (res.body.status === constant.httpCode.OK) {
            this.trigger({
              desc: res.body.quiz.desc,
              templateRepo: res.body.quiz.templateRepo,
              showRepo: true
            });
          }
        });
  },

  onReload: function (orderId) {
    this.onChangeOrderId(orderId);
  }
});

module.exports = HomeworkIntroductionStore;