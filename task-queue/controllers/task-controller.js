'use strict';

var request = require('superagent');
var async = require('async');
var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');
var constant = require('../mixin/constant');
var UserHomeworkQuizzes = require('../models/user-homework-quizzes');
var UserHomeworkAnswer = require('../models/user-homework-answer');

function TaskController () {}

TaskController.prototype.createTask = (req, res) => {
  var uniqId = req.body.uniqId;
  var createJobStr = config.CIServer + '/job/' + config.jobName + '/buildWithParameters';
  var callbackURL = config.taskServer + ':' + config.port + '/tasks/' + uniqId + '/completion';

  async.waterfall([
    (done) => {
      UserHomeworkAnswer.updateStatus(uniqId, constant.homeworkQuizzesStatus.LINE_UP, done);
    }
  ], (err, product, numAffected) => {
    request
      .post(createJobStr)
      .set('Content-Type', 'application/json')
      .query({
        USER_REPO: req.body.userAnswerRepo,
        CALLBACK_URL: callbackURL,
        BRANCH: req.body.branch,
        EVALUATE_SCRIPT_URL: config.nginxServer + req.body.evaluateScript
      })
      .end((err, response) => {
        if (err){
          res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
        }else {
          res.send({
            status: constant.httpCode.OK
          });
        }
      });
  });
};

TaskController.prototype.result = (req, res) => {
  var userHomeworkQuiz ;
  var uniqId = req.params.uniqId;

  async.waterfall([
    (done) => {
      if(req.body.result === constant.homeworkQuizzesStatus.PROGRESS) {
        UserHomeworkAnswer.updateStatus(uniqId, req.body.result, done);
      }else {
        UserHomeworkAnswer.writeResult(uniqId, req.body, done);
      }
    },
    (product, numAffected, done) => {
      if (req.body.result === constant.homeworkQuizzesStatus.SUCCESS) {
        UserHomeworkQuizzes.findQuizInfo(uniqId, (err, doc) => {
          var firstIndex = 0;

          request.post(config.apiServer + '/scoresheets')
              .set('Content-Type', 'application/json')
              .send({
                examerId: doc.userId,
                paperId: doc.paperId,
                homeworkSubmits: [{
                  homeworkQuizId: doc.quizzes[firstIndex].id,
                  startTime: doc.quizzes[firstIndex].startTime,
                  homeworkSubmitPostHistory: doc.quizzes[firstIndex].homeworkSubmitPostHistory
                }]
              })
              .end(done);
        });
      } else {
        done(null);
      }
    }
  ],(err, product, numAffected) => {
    if(err) {
      res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
    }else {
      res.send({
        status: constant.httpCode.OK
      });
    }
  });
};

TaskController.prototype.status = (req, res) => {
  async.series({
    awaitTask: (done) => {
      request
        .get(config.CIServer + '/queue/api/json')
        .end(done);
    },
    ExecutorStatus: (done) => {
      request
        .get(config.CIServer + '/api/json?depth=1&tree=assignedLabels[busyExecutors,idleExecutors,totalExecutors]')
        .end(done);
    }
  }, (err, data) => {
    if(err) {
      res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
    }else {
      var result = data.ExecutorStatus.body.assignedLabels.pop();
      result.awaitTask = data.awaitTask.body.items.length;

      res.send(result);
    }
  });
};

module.exports = TaskController;
