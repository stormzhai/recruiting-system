'use strict';

var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var userHomeworkAnswer = require('../models/user-homework-answer');
var async = require('async');
var constant = require('../mixin/constant');
var apiRequest = require('../services/api-request');
var request = require('superagent');
var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');
var mongoose = require('mongoose');

function HomeworkController() {}

HomeworkController.prototype.getList = (req, res, next) => {

  var userId = req.session.user.id;

  userHomeworkQuizzes.findOne({userId: userId}, function(err, data) {
    if(err) {return next(req, res, err);}

    res.send({
      status: constant.httpCode.OK,
      homeworkQuizzes: data.quizzes
    });
  });
};

HomeworkController.prototype.updateStatus = (req, res, next) => {

  var target;

  async.waterfall([
    (done) => {
      var id = new mongoose.Types.ObjectId(req.params.historyId);
      userHomeworkQuizzes
          .aggregate([
            {"$unwind": "$quizzes"},
            {"$unwind": "$quizzes.homeworkSubmitPostHistory"}
          ])
          .match({'quizzes.homeworkSubmitPostHistory': id})
          .exec(done);
    },

    (data, done) => {
      if(!data.length) {
        done(new Error("没有找到相应资源：" + req.params.historyId), null)
      }

      target = data[0];
      userHomeworkQuizzes.findOne(data[0]._id, done)
    },

    (data, done) => {
      var quiz = data.quizzes.find((item, idx, doc) => {
        return item._id.toString() === target.quizzes._id.toString();
      });
      debugger;
      quiz.status = parseInt(req.body.status) || 1;
      data.save(done);
    },

  ], (err, data) => {
    if(err) {return next(req, res, err);}
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

      apiRequest.get(result.uri, done);
    },

    (data, done) => {
      result.desc = data.body.description;
      result.templateRepo = data.body.templateRepository;
      done(null, result);
    }
  ], (err, data) => {
    if(err) {return next(req, res, err);}

    res.send({
      status: constant.httpCode.OK,
      quiz: result
    });
  });
};

HomeworkController.prototype.saveGithubUrl = (req, res, next) => {
  var userHomework;
  var orderId = parseInt(req.body.orderId) || 1;
  var index = orderId - 1;

  async.waterfall([
    (done) => {
      var userId = req.session.user.id;
      userHomeworkQuizzes.findOne({userId: userId}).exec(done);
    },

    (data, done) => {
      userHomework = data;
      index = Math.max(0, index);
      index = Math.min(data.quizzes.length - 1, index);
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
      })
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
      userHomework.save(function(err) {
        done(err, data.body);
      });
    }
  ], (err, data) => {
    if(err) {return next(req, res, err);}
    res.send(data);
  })
};

HomeworkController.prototype.getResult = (req, res) => {
  var userId = req.session.user ? req.session.user.id : 'invalid';
  var orderId = parseInt(req.query.orderId, 10) || 1;
  var history, isSubmited, resultText;

  userHomeworkQuizzes.findOne({userId: userId})
      .populate('quizzes.homeworkSubmitPostHistory')
      .exec(function(err, data) {

        var quizzesLength = (data && data.quizzes) ? data.quizzes.length : 0;
        orderId = Math.max(1, orderId);
        orderId = Math.min(orderId, quizzesLength);

        if (0 === orderId) {
          res.send();
        } else {
          history = data.quizzes[orderId - 1].homeworkSubmitPostHistory ? data.quizzes[orderId - 1].homeworkSubmitPostHistory : [];
          isSubmited = history.length > 0;
          if (isSubmited && history[history.length - 1].homeworkDetail) {
            resultText = history[history.length - 1].homeworkDetail;
            resultText = new Buffer(resultText, 'base64').toString('utf8');
          }
          res.send({
            isSubmited: isSubmited,
            resultText: resultText
          });
        }
      });
};


module.exports = HomeworkController;
