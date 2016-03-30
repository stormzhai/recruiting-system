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

var hour = constant.time.HOURS_PER_DAY;
var mintues = constant.time.MINUTE_PER_HOUR;
var second = constant.time.SECONDS_PER_MINUTE;

var dayToSecond = second * mintues * hour;
var hourToSecond = second * mintues;
var mintuesToSecond = mintues;

var BREAK_LINE_CODE = 10;
var CUT_OFF_RATE = 0.6;


function PaperController() {

}

function getUserDataByPaperId(paperId, callback) {

  var logicPuzzleURL = 'papers/' + paperId + '/logicPuzzle';
  var usersDetailURL = 'papers/' + paperId + '/usersDetail';

  async.parallel({
    usersDetail: function (done) {
      apiRequest.get(usersDetailURL, function (err, data) {
        done(err, data.body);
      });
    },
    logicPuzzles: function (done) {
      apiRequest.get(logicPuzzleURL, function (err, data) {
        done(err, data.body);
      });
    },
    homeworks: function (done) {
      userHomeworkQuizzes.find({paperId: paperId}, function (err, data) {
        done(err, data);
      });
    }
  }, callback);
}

function buildUserSummary(data) {
  return {
    name: data.name,
    mobilePhone: data.mobilePhone,
    email: data.email
  };
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


function createHomework(homeworks, userId) {

  var sumTime = 0;
  var correctNumber = 0;
  var passStandard = 0.6;
  var startTime = 0;
  var homework = {};

  var data = getHomeworkByUserId(homeworks, userId);

  data.quizzes.forEach(function (result, index) {
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

    if (index === 0) {
      startTime = (result.startTime === undefined) ? '--' : moment.unix(result.startTime).format('YYYY-MM-DD HH:mm:ss');
    }

    sumTime += elapsedTime;
  });

  var accuracy = correctNumber / data.quizzes.length;


  homework.elapsedTime = sumTime;
  homework.homeworkDetailsAccuracy = accuracy.toFixed(2);
  homework.correctNumber = correctNumber;
  homework.quizNumber = data.quizzes.length;
  homework.isHomeworkPassed = (accuracy > passStandard) ? '是' : '否';
  homework.homeWorkStartTime = startTime;

  return homework;
}

function createScoresheetInfo(paperId, callback) {

  getUserDataByPaperId(paperId, function (err, usersData) {
    if (err) {
      callback(err);
      return;
    }


    var result = usersData.usersDetail.map((detail) => {

      var userSummary = buildUserSummary(detail);

      var logicPuzzleSummary = usersData.logicPuzzles.find((item) => {
        return item.userId = detail.userId;
      });

      var homeworkSummary = createHomework(usersData.homeworks, detail.userId);

      return Object.assign({}, userSummary, logicPuzzleSummary, homeworkSummary);
    });
    console.log(result);

    callback(null, {
      usersInfo: result
    });
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

function calcHomeworkElapsedTime(elapsedTime) {

  var elapsedDay = 0;
  var elapsedHour = 0;
  var elapsedMintues = 0;
  var time = elapsedTime;

  elapsedDay = Math.floor(time / dayToSecond);
  time -= elapsedDay * dayToSecond;
  elapsedHour = Math.floor(time / hourToSecond);
  time -= hourToSecond * elapsedHour;
  elapsedMintues = Math.floor(time / mintuesToSecond);

  return elapsedDay + '天' + elapsedHour + '小时' + elapsedMintues + '分';
}

function createScoresheetCsvForPaper(paperId, usersInfo, callback) {

  var usersCsvInfo = [];

  var logicPuzzleElapsedTime = 0;
  var fieldNames = ['姓名', '电话', '邮箱', '逻辑题准确率', '逻辑题是否通过', '逻辑题开始时间', '逻辑题花费时间', '编程题正确率', '编程题是否通过', '编程题开始时间', '编程题花费时间', '编程题详情'];

  usersInfo.forEach((userInfo)=> {

    var logicPuzzleAccury = (userInfo.correctNumber / userInfo.itemNumber).toFixed(2);
    var isLogicPuzzlePassed = logicPuzzleAccury > CUT_OFF_RATE ? '是' : '否';

    usersCsvInfo.push({
      name: userInfo.name,
      mobilePhone: userInfo.mobilePhone,
      email: userInfo.email,
      logicPuzzleAccuracy: logicPuzzleAccury,
      isLogicPuzzlePassed: isLogicPuzzlePassed,
      logicPuzzleStartTime: moment.unix(userInfo.startTime).format('YYYY-MM-DD HH:mm:ss'),
      logicPuzzleElapsedTime: calcLogicPuzzleElapsedTime(userInfo),
      homeworkDetailsAccuracy: userInfo.homeworkDetailsAccuracy,
      isHomeworkPassed: userInfo.isHomeworkPassed,
      homeworkStartTime: userInfo.homeWorkStartTime,
      homeworkElapsedTime: calcHomeworkElapsedTime(userInfo.elapsedTime),
      homeworkDetails: config.appServer + 'paper/' + paperId + '/user/' + userInfo.userId + '/homework-details'
    });

  });

  var fields = ['name', 'mobilePhone', 'email', 'logicPuzzleAccuracy', 'isLogicPuzzlePassed', 'logicPuzzleStartTime', 'logicPuzzleElapsedTime', 'homeworkDetailsAccuracy', 'isHomeworkPassed', 'homeworkStartTime', 'homeworkElapsedTime', 'homeworkDetails'];

  json2csv({data: usersCsvInfo, fields: fields, fieldNames: fieldNames}, function (err, csv) {
    callback(csv);
  });
}

PaperController.prototype.exportPaperScoresheetCsv = (req, res, next)=> {
  var paperId = req.params.paperId;

  createScoresheetInfo(paperId, function (err, scoresheetInfo) {
    if (err) {
      next(err);
      return;
    }

    createScoresheetCsvForPaper(paperId, scoresheetInfo.usersInfo, function (csv) {
      var time = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY-MM-DD');
      var fileName = time + '/paper-' + paperId + '.csv';

      csv = csv.split('\\n').join(String.fromCharCode(BREAK_LINE_CODE));
      res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '');
      res.setHeader('Content-Type', 'text/csv');
      res.send(csv);
    });


  });
};

function getHomeworkDetailsByUserId(userId, callback) {
  var userDetailURL = 'users/' + userId + '/detail';

  async.parallel({
    userDetail: function (done) {
      apiRequest.get(userDetailURL, done);
    },
    homework: function (done) {
      userHomeworkQuizzes.findOne({userId: userId}, done);
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

function createHomeworkDetail(quiz) {
  var homeworkDetails = {};
  var sumTime = 0;
  var elapsedTime = 0;

  if (quiz.homeworkSubmitPostHistory.length !== 0) {
    var homeworkSubmitPostHistoryLength = quiz.homeworkSubmitPostHistory.length - 1;
    elapsedTime = quiz.homeworkSubmitPostHistory[homeworkSubmitPostHistoryLength].commitTime - quiz.startTime;
    if (quiz.homeworkSubmitPostHistory[quiz.homeworkSubmitPostHistory.length - 1].homeworkDetail !== undefined) {
      homeworkDetails.lastCommitedDetail = new Buffer(quiz.homeworkSubmitPostHistory[quiz.homeworkSubmitPostHistory.length - 1].homeworkDetail, 'base64').toString('utf8');
    } else {
      homeworkDetails.lastCommitedDetail = '--';
    }

  }

  sumTime += elapsedTime;

  homeworkDetails.id = quiz.id;
  homeworkDetails.address = quiz.uri;
  homeworkDetails.startTime = quiz.startTime;
  homeworkDetails.commitNumbers = quiz.homeworkSubmitPostHistory.length;
  homeworkDetails.elapsedTime = sumTime;
  homeworkDetails.isPassed = (quiz.status === constant.homeworkQuizzesStatus.SUCCESS) ? '是' : '否';

  return homeworkDetails;
}

function createUserHomeworkDetails(paperId, userId, callback) {

  getHomeworkDetailsByUserId(userId, (data)=> {

    var userHomeworkDetails = {};
    var usersInfo = [];
    if (data.httpCode !== constant.httpCode.NOT_FOUND) {

      data.result.homework.quizzes.forEach((quiz, index)=> {

        var userInfo = {};
        if (index === 0) {
          userInfo.userDetail = buildUserSummary(data.result.userDetail.body);
        } else {
          userInfo.userDetail = buildUserSummary({
            name: '',
            mobilePhone: '',
            email: ''
          });
        }
        userInfo.userId = userId;
        userInfo.homeworkDetails = createHomeworkDetail(quiz);

        usersInfo.push(userInfo);
      });

      userHomeworkDetails.httpCode = data.httpCode;

    } else {
      userHomeworkDetails.httpCode = constant.httpCode.NOT_FOUND;
    }

    userHomeworkDetails.usersInfo = usersInfo;
    callback(userHomeworkDetails);
  });
}

function createUserHomeworkDetailsCsv(paperId, userHomeworkDetails, callback) {

  var usersCsvInfo = [];

  var fieldNames = ['姓名', '电话', '邮箱', '编程题编号', '编程题地址', '开始时间', '提交次数', '编程题花费时间', '编程题是否通过', '最后一次提交详情', '提交历史详情'];

  userHomeworkDetails.usersInfo.forEach((userInfo)=> {
    var startTime = userInfo.homeworkDetails.startTime;
    startTime = startTime === undefined ? '--' : moment.unix(userInfo.homeworkDetails.startTime).format('YYYY-MM-DD HH:mm:ss');
    usersCsvInfo.push({
      name: userInfo.userDetail.name,
      mobilePhone: userInfo.userDetail.mobilePhone,
      email: userInfo.userDetail.email,
      id: userInfo.homeworkDetails.id,
      address: userInfo.homeworkDetails.address,
      startTime: startTime,
      commitNumbers: userInfo.homeworkDetails.commitNumbers,
      elapsedTime: calcHomeworkElapsedTime(userInfo.homeworkDetails.elapsedTime),
      isPassed: userInfo.homeworkDetails.isPassed,
      lastCommitedDetail: userInfo.homeworkDetails.lastCommitedDetail,
      homeworkDetailsUrl: config.appServer + 'paper/' + paperId + '/user/' + userInfo.userId + '/homeworkQuiz/' + userInfo.homeworkDetails.id
    });

  });

  var fields = ['name', 'mobilePhone', 'email', 'id', 'address', 'startTime', 'commitNumbers', 'elapsedTime', 'isPassed', 'lastCommitedDetail', 'homeworkDetailsUrl'];

  json2csv({data: usersCsvInfo, fields: fields, fieldNames: fieldNames}, function (err, csv) {
    callback(csv);
  });
}

PaperController.prototype.exportUserHomeworkDetailsCsv = (req, res)=> {
  var paperId = req.params.paperId;
  var userId = req.params.userId;

  createUserHomeworkDetails(paperId, userId, function (userHomeworkDetails) {

    if (userHomeworkDetails.httpCode === constant.httpCode.NOT_FOUND) {
      res.sendStatus(constant.httpCode.NOT_FOUND);
    } else {
      createUserHomeworkDetailsCsv(paperId, userHomeworkDetails, function (csv) {

        var time = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY-MM-DD');
        var fileName = time + '-paper-' + paperId + '-user-' + userId + '.csv';

        csv = csv.split('\\n').join(String.fromCharCode(BREAK_LINE_CODE));
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '');
        res.setHeader('Content-Type', 'text/csv');

        res.send(csv);
      });
    }
  });
};

function createHomeworkQuizDetail(commitItem) {
  var homeworkQuizDetail = {};
  homeworkQuizDetail.commitAddress = commitItem.homeworkURL;
  homeworkQuizDetail.homeworkDetail = (commitItem.homeworkDetail === undefined) ? '--' : new Buffer(commitItem.homeworkDetail, 'base64').toString('utf8');
  return homeworkQuizDetail;
}

function getHomeworkQuizByHomeworkquizId(quizzes, quizId) {
  var homeworkquiz;
  quizzes.forEach((quiz)=> {
    if (quiz.id.toString() === quizId) {
      homeworkquiz = quiz;
      return;
    }
  });
  return homeworkquiz;
}

function calculateElapsedTime(index, homeworkquiz) {
  var time;
  if (index === 0) {
    time = homeworkquiz.homeworkSubmitPostHistory[index].commitTime - homeworkquiz.startTime;
  } else {
    time = homeworkquiz.homeworkSubmitPostHistory[index].commitTime - homeworkquiz.homeworkSubmitPostHistory[index - 1].commitTime;
  }
  return time;
}

function createUserHomeworkQuizDetails(paperId, userId, homeworkquizId, callback) {

  getHomeworkDetailsByUserId(userId, (data)=> {
    var userHomeworkDetails = {};
    var usersInfo = [];
    if (data.httpCode !== constant.httpCode.NOT_FOUND) {
      var homeworkquiz = getHomeworkQuizByHomeworkquizId(data.result.homework.quizzes, homeworkquizId);

      if (homeworkquiz !== undefined && homeworkquiz.homeworkSubmitPostHistory.length !== 0) {

        homeworkquiz.homeworkSubmitPostHistory.forEach((commitItem, index)=> {
          var userInfo = {};
          if (index === 0) {
            userInfo.userDetail = buildUserSummary(data.result.userDetail.body);

            userInfo.startTime = homeworkquiz.startTime;

            userInfo.uri = homeworkquiz.uri;

          } else {
            userInfo.userDetail = buildUserSummary({
              name: '',
              mobilePhone: '',
              email: ''
            });
            userInfo.startTime = '';
            userInfo.uri = '';

          }
          userInfo.userId = userId;
          userInfo.homeworkDetails = createHomeworkQuizDetail(commitItem);
          userInfo.homeworkDetails.elapsedTime = calculateElapsedTime(index, homeworkquiz);

          usersInfo.push(userInfo);
        });
      }
      userHomeworkDetails.httpCode = data.httpCode;
    } else {
      userHomeworkDetails.httpCode = constant.httpCode.NOT_FOUND;
    }

    userHomeworkDetails.usersInfo = usersInfo;
    callback(userHomeworkDetails);
  });
}

function createUserHomeworkQuizDetailsCsv(paperId, userHomeworkDetails, callback) {
  var usersCsvInfo = [];

  var fieldNames = ['姓名', '电话', '邮箱', '编程题题目地址', '开始时间', '提交作业记录', '分析记录', '花费时间'];

  userHomeworkDetails.usersInfo.forEach((userInfo)=> {
    var startTime = userInfo.startTime;
    startTime = startTime === '' ? '' : moment.unix(startTime).format('YYYY-MM-DD HH:mm:ss');

    usersCsvInfo.push({
      name: userInfo.userDetail.name,
      mobilePhone: userInfo.userDetail.mobilePhone,
      email: userInfo.userDetail.email,
      homeworkAddress: userInfo.uri,
      startTime: startTime,
      commitUrlLog: userInfo.homeworkDetails.commitAddress,
      commitResultLog: userInfo.homeworkDetails.homeworkDetail,
      elapsedTime: calcHomeworkElapsedTime(userInfo.homeworkDetails.elapsedTime)
    });
  });

  var fields = ['name', 'mobilePhone', 'email', 'homeworkAddress', 'startTime', 'commitUrlLog', 'commitResultLog', 'elapsedTime'];

  json2csv({data: usersCsvInfo, fields: fields, fieldNames: fieldNames}, function (err, csv) {
    callback(csv);
  });
}

PaperController.prototype.exportUserHomeworkQuizDetailsCsv = (req, res)=> {
  var paperId = req.params.paperId;
  var userId = req.params.userId;
  var homeworkquizId = req.params.homeworkquizId;

  createUserHomeworkQuizDetails(paperId, userId, homeworkquizId, (userHomeworkDetails)=> {

    if (userHomeworkDetails.httpCode === constant.httpCode.NOT_FOUND) {
      res.sendStatus(constant.httpCode.NOT_FOUND);
    } else {
      createUserHomeworkQuizDetailsCsv(paperId, userHomeworkDetails, (csv) => {

        var time = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY-MM-DD');
        var fileName = time + '-paper-' + paperId + '-user-' + userId + '-homeworkquiz-' + homeworkquizId + '.csv';

        csv = csv.split('\\n').join(String.fromCharCode(BREAK_LINE_CODE));
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '');
        res.setHeader('Content-Type', 'text/csv');


        res.send(csv);
      });
    }
  });
};

module.exports = PaperController;
