/*eslint no-magic-numbers: 2*/
'use strict';

var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var async = require('async');
var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var json2csv = require('json2csv');
var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');
var moment = require('moment');

var _percentage = 100;
var hour = constant.time.HOURS_PER_DAY;
var mintues = constant.time.MINUTE_PER_HOUR;
var second = constant.time.SECONDS_PER_MINUTE;

var dayToSecond = second * mintues * hour;
var hourToSecond = second * mintues;
var mintuesToSecond = mintues;

function PaperController() {

}


function getUserDataByPaperId(paperId, callback) {

  var logicPuzzleURL = 'papers/' + paperId + '/logicPuzzle';
  var usersDetailURL = 'papers/' + paperId + '/usersDetail';

  async.parallel({
    usersDetail: function (done) {
      apiRequest.get(usersDetailURL, done);
    },
    logicPuzzles: function (done) {

      apiRequest.get(logicPuzzleURL, done);
    },
    homeworks: function (done) {
      userHomeworkQuizzes.find({paperId: paperId}, done);
    }
  }, (err, result)=> {
    if (err) {
      callback({
        httpCode: constant.httpCode.NOT_FOUND
      });
    } else {
      callback({
        result: result,
        httpCode: constant.httpCode.OK
      });
    }
  });
}


function createUserDetail(data) {
  return {
    name: data.name,
    mobilePhone: data.mobilePhone,
    email: data.email
  };
}

function getLogicPuzzleByUserId(logicPuzzles, userId) {

  var logicPuzzleInfo;
  logicPuzzles.forEach((logicPuzzle)=> {
    if (logicPuzzle.userId === userId) {
      logicPuzzleInfo = logicPuzzle;
      return;
    }
  });

  return logicPuzzleInfo;
}


function getHomeworkByUserId(homeworks, userId) {

  var homeworkInfo;
  homeworks.forEach((homework)=> {
    if (homework.userId === userId) {
      homeworkInfo = homework;
      return;
    }
  });

  return homeworkInfo;
}


function createLogicPuzzle(logicPuzzles, userId) {

  var accuracy = 0;
  var logicPuzzle = getLogicPuzzleByUserId(logicPuzzles, userId);


  var itemNumber = logicPuzzle.itemNumber;
  var correctNumber = logicPuzzle.correctNumber;

  if (correctNumber !== 0) {
    accuracy = ((correctNumber / itemNumber) * _percentage).toFixed(2);
  }

  return {
    correctNumber: correctNumber,
    itemNumber: itemNumber,
    startTime: logicPuzzle.startTime,
    endTime: logicPuzzle.endTime,
    accuracy: accuracy + '%'
  };
}

function createHomework(homeworks, userId) {

  var sumTime = 0;
  var correctNumber = 0;
  var homework = {
    quizzes: []
  };

  var data = getHomeworkByUserId(homeworks, userId);

  data.quizzes.forEach(function (result) {
    var commitHistory = [];
    var elapsedTime = 0;

    if (result.homeworkSubmitPostHistory.length !== 0) {
      var homeworkSubmitPostHistoryLength = result.homeworkSubmitPostHistory.length - 1;
      result.homeworkSubmitPostHistory.forEach(function (log) {
        var commit = {};
        commit.githubURL = log.homeworkURL;
        commit.branch = log.branch;
        commit.commitTime = log.commitTime;
        commit.resultURL = log.resultURL;
        commitHistory.push(commit);
      });
      elapsedTime = result.homeworkSubmitPostHistory[homeworkSubmitPostHistoryLength].commitTime - result.startTime;
    }
    if ((result.homeworkSubmitPostHistory.length !== 0) && result.homeworkSubmitPostHistory[homeworkSubmitPostHistoryLength].status === constant.homeworkQuizzesStatus.SUCCESS) {
      correctNumber++;
    }

    sumTime += elapsedTime;

    var quiz = {
      startTime: result.startTime,
      homeworkDesc: result.uri,
      elapsedTime: elapsedTime,
      commitHistory: commitHistory
    };
    homework.quizzes.push(quiz);
  });

  var completion = (correctNumber / data.quizzes.length) * _percentage;

  homework.elapsedTime = sumTime;
  homework.completion = completion.toFixed(2) + '%';
  homework.correctNumber = correctNumber;
  homework.quizNumber = data.quizzes.length;

  return homework;
}


function createScoresheetInfo(paperId, callback) {

  getUserDataByPaperId(paperId, function (usersData) {
    var ScoresheetInfo = {};
    var usersInfo = [];
    var userId;

    if (usersData.httpCode !== constant.httpCode.NOT_FOUND) {

      usersData.result.usersDetail.body.forEach((userDetail)=> {

        var userInfo = {};
        userId = userDetail.userId;
        userInfo.userId = userId;
        userInfo.userDetail = createUserDetail(userDetail);
        userInfo.logicPuzzle = createLogicPuzzle(usersData.result.logicPuzzles.body, userId);
        userInfo.homework = createHomework(usersData.result.homeworks, userId);

        usersInfo.push(userInfo);
      });

      ScoresheetInfo.httpCode = usersData.httpCode;

    } else {
      ScoresheetInfo.httpCode = constant.httpCode.NOT_FOUND;
    }

    ScoresheetInfo.usersInfo = usersInfo;
    callback(ScoresheetInfo);
  });

}

function calcLogicPuzzleElapsedTime(logicPuzzle) {

  var startTime = logicPuzzle.startTime;
  var endTime = logicPuzzle.endTime;
  var time = endTime - startTime;

  var elapsedHour = 0;
  var elapsedMintues = 0;
  var elapsedSeconds = 0;

  elapsedHour = Math.floor(time / hourToSecond);
  time -= hourToSecond * elapsedHour;
  elapsedMintues = Math.floor(time / mintuesToSecond);
  time -= mintuesToSecond * elapsedMintues;

  return elapsedHour + '小时' + elapsedMintues + '分' + time + '秒';
}

function calcHomeworkElapsedTime(homework) {

  var elapsedDay = 0;
  var elapsedHour = 0;
  var elapsedMintues = 0;
  var time = homework.elapsedTime;

  elapsedDay = Math.floor(time / dayToSecond);
  time -= elapsedDay * dayToSecond;
  elapsedHour = Math.floor(time / hourToSecond);
  time -= hourToSecond * elapsedHour;
  elapsedMintues = Math.floor(time / mintuesToSecond);

  return elapsedDay + '天' + elapsedHour + '小时' + elapsedMintues + '分';
}

function createCSV(usersInfo, callback) {

  var usersCsvInfo = [];

  var logicPuzzleElapsedTime = 0;
  var fieldNames = ['姓名', '电话', '邮箱', '逻辑题准确率', '逻辑题花费时间', '家庭作业详情', '家庭作业花费时间'];

  usersInfo.forEach((userInfo)=> {

    usersCsvInfo.push({
      name: userInfo.userDetail.name,
      mobilePhone: userInfo.userDetail.mobilePhone,
      email: userInfo.userDetail.email,
      accuracy: userInfo.logicPuzzle.accuracy,
      logicPuzzleElapsedTime: calcLogicPuzzleElapsedTime(userInfo.logicPuzzle),
      homeworkDetails: config.appServer + 'homework-details.html?userId=' + userInfo.userId,
      homeworkElapsedTime: calcHomeworkElapsedTime(userInfo.homework)
    });

  });

  var fields = ['name', 'mobilePhone', 'email', 'accuracy', 'logicPuzzleElapsedTime', 'homeworkDetails', 'homeworkElapsedTime'];

  json2csv({data: usersCsvInfo, fields: fields, fieldNames: fieldNames}, function (err, csv) {
    callback(csv);
  });
}


PaperController.prototype.exportCsv = (req, res)=> {
  var paperId = req.params.paperId;
  createScoresheetInfo(paperId, function (scoresheetInfo) {

    if (scoresheetInfo.httpCode === constant.httpCode.NOT_FOUND) {
      res.sendStatus(constant.httpCode.NOT_FOUND);
    } else {

      createCSV(scoresheetInfo.usersInfo, function (csv) {

        var fileName = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY-MM-DD') + '.csv';
        fileName = 'paper-' + paperId + '-' + fileName;
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '');
        res.setHeader('Content-Type', 'text/csv');
        res.send(csv);
      });

    }
  });
};

module.exports = PaperController;
