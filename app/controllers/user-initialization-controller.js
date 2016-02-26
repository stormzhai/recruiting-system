'use strict';

var apiRequest = require('../services/api-request');
var logicPuzzle = require('../models/logic-puzzle');
var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var constant = require('../mixin/constant');
var async = require('async');

function UserInitializationController() {
}

UserInitializationController.prototype.initializeQuizzes = (req, res) => {
  var userId = req.session.user.id;
  var quizItems, quizExamples, blankQuizId, paperId;
  var logicPuzzleUrl = 'papers/enrollment';
  var enrollment;

  async.waterfall([

    (done)=> {

      logicPuzzle.findOne({userId: userId}, (err, data) => {
        if (err) {
          done(err, data);
        } else {
          done(!!data, data);
        }
      });
    }, (data, done)=> {

      apiRequest.get(req,logicPuzzleUrl, done);

    }, (responds, done)=> {

      enrollment = responds.body;
      var quizzes = responds.body.sections[0].quizzes[0];
      blankQuizId = quizzes.id;
      paperId = responds.body.id;
      var itemsUri = quizzes.items_uri;

      done(null, itemsUri);

    }, (itemsUri, done) => {

      apiRequest.get(req,itemsUri, done);

    }, (responds, done) => {

      quizItems = responds.body.quizItems;
      quizExamples = responds.body.exampleItems;

      var isNotExist = true;

      done(null, isNotExist);
    }, (isNotExist, done) => {

      logicPuzzle.create({
        userId: userId,
        quizItems: quizItems,
        quizExamples: quizExamples,
        blankQuizId: blankQuizId,
        paperId: paperId
      }, done);

    }, (doc, done) => {

      userHomeworkQuizzes.initUserHomeworkQuizzes(userId, enrollment.sections[1].quizzes, done);

    }
  ], (err) => {
    if (err && err !== true) {
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
      res.send({status: constant.httpCode.INTERNAL_SERVER_ERROR, message: err.message});
    } else {
      res.send({status: constant.httpCode.OK});
    }
  });
};

module.exports = UserInitializationController;