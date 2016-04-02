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
      userHomework.quizzes[index].homeworkSubmitPostHistory.push(id);
      userHomework.save(function(err) {
        done(err, data.body);
      });
    }
  ], (err, data) => {
    if(err) {
      return next(req, res, err);
    }
    res.send(data);
  })

  //获取用户的题目
  //
  // uri = homeworkQuizzes.quizzes[orderId - 1].uri;
  // apiRequest
  //Todo 对orderId的判断

  // request
  //     .post(config.taskServer + 'tasks')
  //     .set('Content-Type', 'application/json')
  //     .send({
  //       userAnswerRepo: req.body.userAnswerRepo,
  //       evaluateScript: result.body.evaluateScript,
  //       branch: req.body.branch
  //     })
  //     .end(done);

  // res.send("===" + indexId);
}

HomeworkController.prototype.saveGithubUrlBak = (req, res) => {
  var userId = req.session.user.id;
  var orderId = req.body.orderId;
  var uri, uniqId, homeworkQuizzes, quizzesStatus;
  async.waterfall([
    (done) => {
      // 获取作业状态
      userHomeworkQuizzes.getQuizStatus(userId, done);
    },
    (result, done) => {

      quizzesStatus = result;
      // 获取这个用户下面所有的题目的提交状态
      userHomeworkQuizzes.findOne({userId: userId})
          .populate('quizzes.homeworkSubmitPostHistory')
          .exec(done);
    },
    (result, done) => {
      homeworkQuizzes = result;

      // 如果这个题超出了范围或者属于ERROR或者属于活动的或者bulabula
      var quizIndex = orderId - 1;
      var integer = (Number(orderId) === parseInt(orderId, 10));
      var isOutOfRange = (!integer || orderId < 1 || orderId === undefined || orderId > result.quizzes.length);
      var isNotAllow = isOutOfRange ? null : !(quizzesStatus[quizIndex].status === constant.homeworkQuizzesStatus.ACTIVE ||
        quizzesStatus[quizIndex].status === constant.homeworkQuizzesStatus.ERROR);

      // 总之如果符合上述条件，则直接跳过
      if (isOutOfRange || isNotAllow) {
        done(true);
      } else {
      // 创建一道题
        userHomeworkAnswer.create({
          homeworkURL: req.body.userAnswerRepo,
          status: constant.homeworkQuizzesStatus.PROGRESS,
          version: req.body.commitSHA,
          branch: req.body.branch,
          commitTime: Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS
        }, done);
      }
    },
    // 将这道题目的id写入到history里面
    (result, done) => {
      uniqId = result._id;
      uri = homeworkQuizzes.quizzes[orderId - 1].uri;
      homeworkQuizzes.quizzes[orderId - 1].homeworkSubmitPostHistory.push(uniqId);
      homeworkQuizzes.save(done);
    },
    (product, numAffected, done) => {
      // 获取这道题目的详情
      apiRequest.get(uri, done);
    },
    (result, done) => {
      // 调用task
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
