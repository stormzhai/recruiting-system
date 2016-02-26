'use strict';

var express = require('express');
var session = require('supertest-session');
var app = require('../../app');
var request = require('superagent');
var httpStatusCode = require('../../mixin/constant').httpCode;

var testSession = null;

describe('GET /quiz', function(){

  it('can sign in', function(done){

    testSession = session(app);

    spyOn(request, 'post').and.callFake(function() {
      return {
        set: function () {
          return this;
        },
        send: function() {
          return this;
        },
        end: function(fn) {
          fn(null, {
            body:{userInfo:{uri: 'user/1'}, id: 1},
            status:httpStatusCode.OK
          });
        }
      };
    });

    testSession.get('/login')
        .set('Content-Type', 'application/json')
        .query({
          account: 'test@it.com',
          password: 'evanleesucks'
        })
        .expect(httpStatusCode.OK)
        .end(function(err, res) {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });
  });

  it('can get quiz when this quiz is not in mongoDB', function (done) {

    testSession
        .get('/homework/quiz')
        .set('Content-Type', 'application/json')
        .query({
          orderId: 1
        })
        .expect(httpStatusCode.OK)
        .expect({
          status: httpStatusCode.OK,
          quiz: {
            quizStatus: 2,
            desc: '这是一道比较简单的题目',
            templateRepo: 'github.com/homework/1'
          }
        })
        .end(function(err, res) {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });

  });

  it('can get quiz when this quiz is already in mongoDB', function (done) {

    testSession
        .get('/homework/quiz')
        .set('Content-Type', 'application/json')
        .query({
          orderId: 1
        })
        .expect(httpStatusCode.OK)
        .expect({
          status: httpStatusCode.OK,
          quiz: {
            quizStatus: 2,
            desc: '这是一道比较简单的题目',
            templateRepo: 'github.com/homework/1'
          }
        })
        .end(function(err, res) {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });

  });

});


