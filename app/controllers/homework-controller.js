'use strict';

var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var userHomeworkAnswer = require('../models/user-homework-answer');
var async = require('async');
var constant = require('../mixin/constant');
var apiRequest = require('../services/api-request');
var request = require('superagent');
var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');

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

HomeworkController.prototype.getQuiz = (req, res) => {
  var userId = req.session.user ? req.session.user.id : 'invalid';
  var orderId = req.query.orderId;
  var error = {};
  var quizStatus;
  var userAnswerRepo;
  var branch;
  var quiz;

  async.waterfall([

    (done) => {
      userHomeworkQuizzes.getQuizStatus(userId, done);
    },

    (result, done) => {
      if (!(Number(orderId) === parseInt(orderId, 10))) {
        error.status = constant.httpCode.NOT_FOUND;
        done(true, error);
      } else {
        quizStatus = result[orderId - 1].status;
      }
      userHomeworkQuizzes.findOne({userId: userId}).exec(done);
    },

    (result, done) => {
      quiz = result.quizzes[orderId - 1];
      if (orderId === undefined || orderId > result.quizzes.length || orderId < 1) {
        error.status = constant.httpCode.NOT_FOUND;
        done(true, error);
      } else if (quizStatus === constant.homeworkQuizzesStatus.LOCKED) {
        error.status = constant.httpCode.FORBIDDEN;
        done(true, error);
      } else {
        if (quiz.homeworkSubmitPostHistory.length) {
          var userSubmitInfo = quiz.homeworkSubmitPostHistory.pop();
          userAnswerRepo = userSubmitInfo.homeworkURL;
          branch = userSubmitInfo.branch;
        }
        if (!quiz.startTime) {
          quiz.startTime = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
          result.save();
        }
        apiRequest.get(quiz.uri, (err, result) => {
          done(err, result.body);
        });
      }
    },
  ], (err, data) => {
    if (err && (err !== 'break')) {
      if (!data) {
        res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
      }
      res.send({status: data ? data.status : constant.httpCode.INTERNAL_SERVER_ERROR});
    } else {
      res.send({
        status: constant.httpCode.OK,
        quiz: {
          quizStatus: quizStatus,
          desc: data.description,
          templateRepo: data.templateRepository,
          userAnswerRepo: userAnswerRepo,
          branch: branch
        }
      });
    }
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
        evaluateScript: data.body.evaluateScript
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
}

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
