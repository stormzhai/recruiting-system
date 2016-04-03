'use strict';

var Reflux = require('reflux');
var HomeworkActions = require('../../actions/homework/homework-actions');
var superAgent = require('superagent');
var constant = require('../../../../mixin/constant');
var errorHandler = require('../../../../tools/error-handler.jsx');
var async = require('async');

var HomeworkSidebarStore = Reflux.createStore({
  listenables: [HomeworkActions],

  init: function() {
    this.data = {};
  },

  onInit: function() {
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
            .end(done)
      },
    ], (err, data) => {
        if(err) {return errorHandler.showError(err);}
        this.data.currentQuiz = data.body.quiz;
        this.trigger(this.data);
    })
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
        console.log(orderId);
        superAgent.get('/homework/quiz')
            .set('Content-Type', 'application/json')
            .query(query)
            .end(done)
      },
    ], (err, data) => {
        if(err) {return errorHandler.showError(err);}
        console.log(data.quiz);
        this.data.currentQuiz = data.body.quiz;
        this.trigger(this.data);
    })
  },
});

module.exports = HomeworkSidebarStore;
