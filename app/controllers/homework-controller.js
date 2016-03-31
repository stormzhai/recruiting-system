'use strict';

var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var userHomeworkAnswer = require('../models/user-homework-answer');
var async = require('async');
var constant = require('../mixin/constant');
var apiRequest = require('../services/api-request');
var request = require('superagent');
var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');

function HomeworkController() {

}

HomeworkController.prototype.getList = (req, res) => {
  var userId = req.session.user ? req.session.user.id : 'invalid';

  userHomeworkQuizzes.getQuizStatus(userId, (err, quizzesStatus) => {
    if (err) {
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
      res.send({status: constant.httpCode.INTERNAL_SERVER_ERROR, message: err.message});
    } else {
      res.send({
        status: constant.httpCode.OK,
        homeworkQuizzes: quizzesStatus
      });
    }
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
      }else {
        quizStatus = result[orderId - 1].status;
      }
      userHomeworkQuizzes.findOne({userId: userId})
        .populate('quizzes.homeworkSubmitPostHistory')
        .exec(done);
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

HomeworkController.prototype.saveGithubUrl = (req, res) => {
  var userId = req.session.user.id;
  var orderId = req.body.orderId;
  var uri, uniqId, homeworkQuizzes, quizzesStatus;
  async.waterfall([
    (done) => {
      userHomeworkQuizzes.getQuizStatus(userId, done);
    },
    (result, done) => {
      quizzesStatus = result;
      userHomeworkQuizzes.findOne({userId: userId})
          .populate('quizzes.homeworkSubmitPostHistory')
          .exec(done);
    },
    (result, done) => {
      homeworkQuizzes = result;

      var quizIndex = orderId - 1;
      var integer = (Number(orderId) === parseInt(orderId, 10));
      var isOutOfRange = (!integer || orderId < 1 || orderId === undefined || orderId > result.quizzes.length);
      var isNotAllow = isOutOfRange ? null : !(quizzesStatus[quizIndex].status === constant.homeworkQuizzesStatus.ACTIVE ||
        quizzesStatus[quizIndex].status === constant.homeworkQuizzesStatus.ERROR);

      if (isOutOfRange || isNotAllow) {
        done(true);
      } else {
        userHomeworkAnswer.create({
          homeworkURL: req.body.userAnswerRepo,
          status: constant.homeworkQuizzesStatus.PROGRESS,
          version: req.body.commitSHA,
          branch: req.body.branch,
          commitTime: Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS
        }, done);
      }
    },
    (result, done) => {
      uniqId = result._id;
      uri = homeworkQuizzes.quizzes[orderId - 1].uri;
      homeworkQuizzes.quizzes[orderId - 1].homeworkSubmitPostHistory.push(uniqId);
      homeworkQuizzes.save(done);
    },
    (product, numAffected, done) => {
      apiRequest.get(uri, done);
    },
    (result, done) => {
      request
          .post(config.taskServer + 'tasks')
          .set('Content-Type', 'application/json')
          .send({
            uniqId: uniqId,
            userAnswerRepo: req.body.userAnswerRepo,
            evaluateScript: result.body.evaluateScript,
            branch: req.body.branch
          })
          .end(done);
    }
  ], (err, data) => {
    if (err) {
      res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
    } else {
      res.send({
        status: constant.httpCode.OK
      });
    }
  });
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
