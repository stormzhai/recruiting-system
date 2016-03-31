'use strict';

var session = require('supertest-session');
var app = require('../../app');
var request = require('../../services/api-request');
var httpStatusCode = require('../../mixin/constant').httpCode;
var json2csv = require('json2csv');
var PaperController = require('../../controllers/paper-controller');
var fs = require('fs');

var testSession = null;

describe('GET paper/:paperId/scoresheet', function () {

  var paperController = new PaperController();

  it('can sign in', function (done) {

    testSession = session(app);

    spyOn(request, 'post').and.callFake(function (url, body, callback) {
      callback(null, {
        body: {userInfo: {uri: 'user/1'}, id: 1},
        status: httpStatusCode.OK,
        headers: 'yes'
      });
    });

    testSession.post('/login')
        .set('Content-Type', 'application/json')
        .send({
          account: 'hahaha@haha.com',
          password: '99999999'
        })
        .expect(httpStatusCode.OK)
        .end(function (err, res) {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });
  });

  it('could get a paper csv data', function (done) {

    testSession = session(app);

    testSession
        .get('/paper/1/scoresheet')
        .set('Content-Type', 'application/json')
        .expect({
          status: httpStatusCode.OK,
          quiz: {
            quizStatus: 2,
            desc: '这是一道比较简单的题目',
            templateRepo: 'github.com/homework/1'
          }
        })
        .end(function (err, res) {

          var data = '\"姓名\",\"电话\",\"邮箱\",\"逻辑题准确率\",\"逻辑题是否通过\",\"逻辑题开始时间\",\"逻辑题花费时间\",\"编程题正确率\",\"编程题是否通过\",\"编程题开始时间\",\"编程题花费时间\",\"编程题详情\"\n\"测试一\",\"18798037893\",\"test@163.com\",\"0.00\",\"否\",\"2016-01-01 01:01:01\",\"0小时0分1秒\",\"0.00\",\"否\",\"2016-03-31 15:39:17\",\"0天0小时0分\",\"http://localhost:3000/paper/1/user/1/homework-details\"\n\"测试二\",\"18087839393\",\"test2@qq.com\",\"0.00\",\"否\",\"2016-01-01 01:01:01\",\"0小时0分1秒\",\"0.00\",\"否\",\"--\",\"0天0小时0分\",\"http://localhost:3000/paper/1/user/2/homework-details\"';
          expect(res.text).toBe(data);
          done();
        });
  });

});
