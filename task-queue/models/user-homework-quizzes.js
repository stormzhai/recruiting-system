'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constant = require('../mixin/constant');
var _ = require('lodash');

var userHomeworkQuizzesSchema = new Schema({
  userId: Number,
  paperId: Number,
  quizzes: [{
    id: Number,
    status: Number,
    startTime: Number,
    userAnswerRepo: String,
    uri: String,
    branch: String,
    homeworkSubmitPostHistory: [{
      homeworkURL: String,
      status: Number,
      version: String,
      branch: String,
      commitTime: Number,
      resultURL: String,
      homeworkDetail: String
    }]
  }]
});

userHomeworkQuizzesSchema.statics.unlockNext = function (userId, callback) {
  this.findOne({userId: userId}, function (err, data) {
    if (err || !data) {
      callback(err || new Error('user is not allowed'));
    } else {
      var locked = 0;
      var success = 0;

      data.quizzes.forEach(function (quiz) {
        if (quiz.status === constant.homeworkQuizzesStatus.LOCKED) {
          locked++;
        } else if (quiz.status === constant.homeworkQuizzesStatus.SUCCESS) {
          success++;
        }
      });

      if (data.quizzes.length === (locked + success) && success !== data.quizzes.length) {
        data.quizzes[success].status = constant.homeworkQuizzesStatus.ACTIVE;
        data.save(callback);
      } else {
        callback(null, true);
      }
    }
  });
};

userHomeworkQuizzesSchema.statics.updateStatus = function (info, status, callback) {
  this.findOne({userId: info.userId}, (err, doc) => {
    if (err || !doc) {
      callback(true);
    } else {
      doc.quizzes.forEach((item, i) => {
        if (item.id === info.homeworkId){
          doc.quizzes[i].status = status;
          doc.quizzes[i].homeworkSubmitPostHistory[doc.quizzes[i].homeworkSubmitPostHistory.length - 1].status = status;
        }
      });
      doc.save(callback);
    }
  });
};

userHomeworkQuizzesSchema.statics.writeResult = function (info, data, callback) {
  this.findOne({userId: info.userId}, (err, doc) => {
    if (err || !doc) {
      callback(true);
    } else {
      doc.quizzes.forEach((item, i) => {
        if (item.id === info.homeworkId){
          doc.quizzes[i].status = data.result;
          var historyIndex = doc.quizzes[i].homeworkSubmitPostHistory.length - 1;
          doc.quizzes[i].homeworkSubmitPostHistory[historyIndex].status = data.result;
          doc.quizzes[i].homeworkSubmitPostHistory[historyIndex].homeworkDetail = data.resultDetail;
        }
      });
      doc.save(callback);
    }
  });
};

module.exports = mongoose.model('UserHomeworkQuizzes', userHomeworkQuizzesSchema);
