'use strict';

var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var homeworkInfo = require('../models/homework-info');
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
  var quizzesStatus = [];

  async.waterfall([
    (done)=> {
      userHomeworkQuizzes.unlockNext(userId, done);
    },
    (data, result, done) => {
      done = typeof(result) === 'function' ? result : done;
      userHomeworkQuizzes.findOne({userId: userId}, done);
    },
    (data, done)=> {
      data.quizzes.forEach((quiz) => {
        quizzesStatus.push({
          status: quiz.status
        });
      });
      done();
    }
  ], (err) => {
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
      userHomeworkQuizzes.findOne({userId: userId}, done);
    },
    (result, done) => {
      var integer = (Number(orderId) === parseInt(orderId, 10));
      quiz = result.quizzes[orderId - 1];
      if (!integer || orderId === undefined || orderId > result.quizzes.length || orderId < 1) {
        error.status = constant.httpCode.NOT_FOUND;
        done(true, error);
      } else if (quiz.status === constant.homeworkQuizzesStatus.LOCKED) {
        error.status = constant.httpCode.FORBIDDEN;
        done(true, error);
      } else {
        if (quiz.homeworkSubmitPostHistory.length) {
          var userSubmitInfo = quiz.homeworkSubmitPostHistory.pop();

          userAnswerRepo = userSubmitInfo.homeworkURL;
          quizStatus = userSubmitInfo.status;
          branch = userSubmitInfo.branch;
        } else {
          quizStatus = quiz.status;
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
  var homeworkId, uri, uniqId;
  async.waterfall([
    (done) => {
      userHomeworkQuizzes.checkDataForSubmit(userId, orderId, done);
    },
    (result, done) => {
      if (result.isValidate === true) {
        var submitInfo = {
          homeworkURL: req.body.userAnswerRepo,
          status: constant.homeworkQuizzesStatus.PROGRESS,
          version: req.body.commitSHA,
          branch: req.body.branch,
          commitTime: Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS
        };

        result.data.quizzes[orderId - 1].status = constant.homeworkQuizzesStatus.PROGRESS;
        result.data.quizzes[orderId - 1].homeworkSubmitPostHistory.push(submitInfo);

        homeworkId = result.data.quizzes[orderId - 1].id;
        uri = result.data.quizzes[orderId - 1].uri;

        result.data.save(done);
      } else {
        done(true, result);
      }
    },
    (product, numAffected, done) => {
      homeworkInfo.create({
        userId: userId,
        homeworkId: homeworkId
      }, done);
    },
    function (result, done) {
      uniqId = result._id;
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
      if (!data) {
        res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
      } else {
        res.status(data.status);
        res.send({status: data.status});
      }
    } else {
      res.send({
        status: constant.httpCode.OK
      });
    }
  });
};

HomeworkController.prototype.updateResult = (req, res)=> {
  var userId = req.body.userId;
  var homeworkId = req.body.homeworkId;
  var resultStatus = req.body.resultStatus;

  async.waterfall([
    (done) => {
      userHomeworkQuizzes.checkDataForUpdate(userId, homeworkId, done);
    },
    (result, done) => {
      userHomeworkQuizzes.updateQuizzesStatus(req.body, done);
    },
    (result, numAffected, done) => {
      userHomeworkQuizzes.unlockNext(userId, done);
    },
    (data, result, done) => {
      done = typeof(result) === 'function' ? result : done;
      if (!resultStatus) {
        done(null, false);
      } else {
        userHomeworkQuizzes.findOne({
          userId: userId,
          quizzes: {$elemMatch: {id: homeworkId}}
        }, {
          userId: 1,
          paperId: 1,
          quizzes: {$elemMatch: {id: homeworkId}}
        }, done);
      }
    },
    (data, done) => {
      if (data) {
        var homeworkQuiz = data.quizzes.pop();

        apiRequest.post('scoresheets', {
          examerId: userId,
          paperId: data.paperId,
          homeworkSubmits: [{
            homeworkQuizId: homeworkId,
            startTime: homeworkQuiz.startTime,
            homeworkSubmitPostHistory: homeworkQuiz.homeworkSubmitPostHistory
          }]
        }, done);
      } else {
        done(null);
      }
    }], (err, data) => {
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

  userHomeworkQuizzes.findOne({userId: userId}, function(err, data) {

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
