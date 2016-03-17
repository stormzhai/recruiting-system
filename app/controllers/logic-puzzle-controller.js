'use strict';

var logicPuzzle = require('../models/logic-puzzle');
var constant = require('../mixin/constant');
var async = require('async');
var apiRequest = require('../services/api-request');

function LogicPuzzleController() {
}

LogicPuzzleController.prototype.getLogicPuzzle = (req, res)=> {
  var orderId = req.query.orderId;
  var userId = req.session.user.id;

  logicPuzzle.getLogicPuzzle(orderId, userId)
      .then((data) => {
        res.send(data);
      });
};

LogicPuzzleController.prototype.saveAnswer = (req, res) => {
  var orderId = req.body.orderId;
  var userAnswer = req.body.userAnswer;
  var userId = req.session.user.id;

  async.waterfall([
    (done) => {
      logicPuzzle.findOne({userId: userId}, done);
    }, (data, done) => {

      if (orderId > data.quizExamples.length - 1) {
        data.quizItems[orderId - data.quizExamples.length].userAnswer = userAnswer;
        data.save((err, doc)=> {
          done(err, doc);
        });
      } else {
        done(null, 'doc');
      }
    }, (doc, done) => {
      done();
    }
  ], (err) => {
    if (!err) {
      res.sendStatus(constant.httpCode.OK);
    } else {
      res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
    }
  });

};

LogicPuzzleController.prototype.submitPaper = (req, res) => {
  var examerId = req.session.user.id;
  var endTime = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;

  async.waterfall([
    (done) => {
      logicPuzzle.findOne({userId: examerId}, done);
    },
    (data, done) => {
      if (data) {
        data.endTime = endTime;
        data.isCommited = true;
      }
      data.save((err, doc)=> {
        done(err, doc);
      });
    },
    (data, done) => {
      LogicPuzzleController.setScoreSheet(data, done);
    }
  ], (err) => {
    if (!err) {
      res.sendStatus(constant.httpCode.OK);
    } else {
      res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
    }
  });

};

LogicPuzzleController.prototype.dealAgree = (req, res) => {
  var userId = req.session.user.id;
  var isAgreed = req.body.dealAgree;

  async.waterfall([
    (done) => {
      logicPuzzle.findOne({userId: userId}, done);
    }, (data, done) => {
      if(data){
        data.isAgreed = isAgreed;
        data.save(done);
      } else {
        done(true,null);
      }
    }
  ], (err) => {
    if (!err) {
      res.send({status: constant.httpCode.OK});
    } else {
      res.send({status: constant.httpCode.INTERNAL_SERVER_ERROR});
    }
  });
};

LogicPuzzleController.setScoreSheet = (data, done) => {
  var scoreSheetUri = 'scoresheets';
  var itemPosts = [];

  data.quizItems.forEach((quizItem) => {
    itemPosts.push({answer: quizItem.userAnswer, quizItemId: quizItem.id});
  });

  var body = {
    examerId: data.userId,
    paperId: data.paperId,
    blankQuizSubmits: [{
      startTime: data.startTime,
      endTime: data.endTime,
      blankQuizId: data.blankQuizId,
      itemPosts: itemPosts
    }]
  };
  apiRequest.post(scoreSheetUri, body, done);
};

module.exports = LogicPuzzleController;