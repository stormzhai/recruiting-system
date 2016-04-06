'use strict';

var Reflux = require('reflux');
var HomeworkActions = require('../../actions/homework/homework-actions');
var superAgent = require('superagent');
var homeworkQuizzesStatus = require('../../../../mixin/constant').homeworkQuizzesStatus;
var errorHandler = require('../../../../tools/error-handler.jsx');
var async = require('async');

var pollTimeout;
var TIMEOUT = 5000;

var HomeworkSidebarStore = Reflux.createStore({
  listenables: [HomeworkActions],

  init: function () {
    this.data = {};
  },

  hasTaskProcess() {
    return this.data.homeworkQuizzes.some((item) => {
      return item.status === homeworkQuizzesStatus.PROGRESS
    });
  },

  pollData: function () {
    if (this.hasTaskProcess()) {
      pollTimeout = setTimeout(this.onInit, TIMEOUT);
    } else {
      pollTimeout && clearTimeout(pollTimeout);
    }
  },

  onInit: function () {
    async.waterfall([
      (done) => {
        superAgent.get('/homework/get-list')
            .set('Content-Type', 'application/json')
            .end(done);
      },

      (data, done) => {
        this.data.homeworkQuizzes = data.body.homeworkQuizzes;

        var orderId = location.hash.substr(1);
        orderId = parseInt(orderId) || 1;
        orderId = Math.max(orderId, 1);
        orderId = Math.min(orderId, this.data.homeworkQuizzes.length);
        this.data.orderId = orderId;

        done(null, {
          orderId: orderId
        });
      },

      (query, done) => {
        superAgent.get('/homework/quiz')
            .set('Content-Type', 'application/json')
            .query(query)
            .end(done);
      }
    ], (err, data) => {
      if (err) {
        return errorHandler.showError(err);
      }
      this.data.currentQuiz = data.body.quiz;
      this.trigger(this.data);
      this.pollData();
    });
  },

  onCreateTask: function (data) {
    async.waterfall([
      (done) => {
        superAgent.post('homework/save')
            .set('Content-Type', 'application/json')
            .send(data)
            .end(done);
      },

      (data, done) => {
        this.data.currentQuiz.status = data.body.status;
        this.data.currentQuiz.result = data.body.result;
        this.data.homeworkQuizzes[this.data.orderId - 1].status = data.body.status;
        done(null, null);
      }
    ], (err, data) => {
      if (err) {
        return errorHandler.showError(err);
      }
      this.trigger(this.data);
      this.pollData();
    });
  },

  onChangeOrderId: function (orderId) {
    async.waterfall([
      (done) => {
        var orderId = location.hash.substr(1);
        orderId = parseInt(orderId) || 1;
        orderId = Math.max(orderId, 1);
        orderId = Math.min(orderId, this.data.homeworkQuizzes.length);
        this.data.orderId = orderId;

        done(null, {
          orderId: orderId
        });
      },

      (query, done) => {
        superAgent.get('/homework/quiz')
            .set('Content-Type', 'application/json')
            .query(query)
            .end(done);
      }
    ], (err, data) => {
      if (err) {
        return errorHandler.showError(err);
      }
      this.data.currentQuiz = data.body.quiz;
      this.trigger(this.data);
      this.pollData();
    });
  }
});

module.exports = HomeworkSidebarStore;
