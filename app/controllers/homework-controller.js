'use strict';

var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var async = require('async');
var constant = require('../mixin/constant');
var apiRequest = require('../services/api-request');
var request = require('superagent');
var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');
var mongoose = require('mongoose');

function getDesc(status, realDesc) {
  if (status === constant.homeworkQuizzesStatus.LOCKED) {
    return '## 当前题目未解锁,请先完成之前的题目.';
  } else {
    return realDesc;
  }
}

function HomeworkController() {
}

HomeworkController.prototype.getList = (req, res, next) => {

  var userId = req.session.user.id;

  userHomeworkQuizzes.findOne({userId: userId}, function (err, data) {
    if (err) {
      return next(req, res, err);
    }

    res.send({
      status: constant.httpCode.OK,
      homeworkQuizzes: data.quizzes
    });
  });
};

HomeworkController.prototype.updateStatus = (req, res, next) => {

  var homewrok;

  async.waterfall([
    (done) => {
      var id = new mongoose.Types.ObjectId(req.params.historyId);
      userHomeworkQuizzes
          .aggregate([
            {'$unwind': '$quizzes'},
            {'$unwind': '$quizzes.homeworkSubmitPostHistory'}
          ])
          .match({'quizzes.homeworkSubmitPostHistory': id})
          .exec(done);
    },

    (data, done) => {
      if (!data.length) {
        done(new Error('没有找到相应资源：' + req.params.historyId), null);
      }

      homewrok = data[0];
      userHomeworkQuizzes.findOne(data[0]._id, done);
    },

    (data, done) => {
      var nextIdx;

      var quiz = data.quizzes.find((item, idx, doc) => {
        var match = item._id.toString() === homewrok.quizzes._id.toString();
        if (match) {
          nextIdx = idx + 1;
        }
        return match;
      });

      quiz.status = parseInt(req.body.status) || 1;
      if (quiz.status === constant.homeworkQuizzesStatus.SUCCESS && data.quizzes[nextIdx]) {
        data.quizzes[nextIdx].status = constant.homeworkQuizzesStatus.ACTIVE;
      }
      data.save(done);
    }

  ], (err, data) => {
    if (err) {
      return next(req, res, err);
    }
    res.send(data);
  });
};

HomeworkController.prototype.getQuiz = (req, res, next) => {

  var userId = req.session.user.id;
  var orderId = parseInt(req.query.orderId, 10) || 1;
  var result = {};

  async.waterfall([
    (done) => {
      userHomeworkQuizzes.findOne({userId: userId}, done);
    },

    (data, done) => {
      orderId = Math.max(orderId, 1);
      orderId = Math.min(orderId, data.quizzes.length);
      var index = orderId - 1;
      done(null, data.quizzes[index]);
    },

    (data, done) => {
      result.uri = data.uri;
      result.status = data.status;
      var histories = data.homeworkSubmitPostHistory;
      var lastHomeworkSubmitId = histories[histories.length - 1];
      request
          .get(config.taskServer + 'tasks/' + lastHomeworkSubmitId)
          .set('Content-Type', 'application/json')
          .end(done);
    },

    (data, done) => {
      result.userAnswerRepo = data.body.userAnswerRepo;
      result.branch = data.body.branch;
      result.result = data.body.result;

      apiRequest.get(result.uri, done);
    },

    (data, done) => {
      result.desc = getDesc(result.status, data.body.description);
      result.templateRepo = data.body.templateRepository;
      done(null, result);
    }
  ], (err, data) => {
    if (err) {
      return next(req, res, err);
    }
    res.send({
      status: constant.httpCode.OK,
      quiz: result
    });
  });
};

HomeworkController.prototype.saveGithubUrl = (req, res, next) => {
  var userHomework;
  var index;

  async.waterfall([
    (done) => {
      var userId = req.session.user.id;
      userHomeworkQuizzes.findOne({userId: userId}).exec(done);
    },

    (data, done) => {
      userHomework = data;

      var orderId = parseInt(req.body.orderId) || 1;
      orderId = Math.max(1, orderId);
      orderId = Math.min(data.quizzes.length - 1, orderId);
      index = orderId - 1;
      done(null, data.quizzes[index].uri);
    },

    (uri, done) => {
      apiRequest.get(uri, done);
    },

    (data, done) => {
      done(null, {
        branch: req.body.branch,
        userAnswerRepo: req.body.userAnswerRepo,
        evaluateScript: data.body.evaluateScript,
        callbackUrl: config.appServer + 'homework/status'
      });
    },

    (data, done) => {
      request
          .post(config.taskServer + 'tasks')
          .set('Content-Type', 'application/json')
          .send(data)
          .end(done);
    },

    (data, done) => {
      var id = data.body.id;
      userHomework.quizzes[index].status = data.body.status;
      userHomework.quizzes[index].homeworkSubmitPostHistory.push(id);
      userHomework.save(function (err) {
        done(err, data.body);
      });
    }
  ], (err, data) => {
    if (err) {
      return next(req, res, err);
    }
    res.send(data);
  });
};

module.exports = HomeworkController;
