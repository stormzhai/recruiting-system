'use strict';

var express = require('express');
var session = require('supertest-session');
var app = require('../../app');
var request = require('../../services/api-request');
var httpStatusCode = require('../../mixin/constant').httpCode;

var testSession = null;

describe('GET /user/feedback-result', function () {

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
          account: 'test@it.com',
          password: 'evanleesucks'
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

  it('can get user logicPuzzle and howework feedback', function (done) {

    testSession
        .get('/user/feedback-result')
        .set('Content-Type', 'application/json')
        .end(function (err, res) {

          var data = {
            userId: 1,
            logicPuzzle: {
              isCompleted: true,
              time: '0小时0分1秒'
            },
            homework: [
              {
                commitedNumbers: 0,
                time: 0,
                isCompleted: false
              }, {
                commitedNumbers: 0,
                time: 0,
                isCompleted: false
              }, {
                commitedNumbers: 0,
                time: 0,
                isCompleted: false
              }, {
                commitedNumbers: 0,
                time: 0,
                isCompleted: false
              }, {
                commitedNumbers: 0,
                time: 0,
                isCompleted: false
              }, {
                commitedNumbers: 0,
                time: 0,
                isCompleted: false
              }, {
                commitedNumbers: 0,
                time: 0,
                isCompleted: false
              }, {
                commitedNumbers: 0,
                time: 0,
                isCompleted: false
              }, {
                commitedNumbers: 0,
                time: 0,
                isCompleted: false
              }, {
                commitedNumbers: 0,
                time: 0,
                isCompleted: false
              }], httpCode: 200
          };

          expect(res.body).toEqual(data);
          done();
        });
  });


});

