'use strict';

var express = require('express');
var session = require('supertest-session');
var app = require('../../app');
var request = require('superagent');
var httpStatusCode = require('../../mixin/constant').httpCode;

var testSession = null;

describe('GET /initializeQuizzes', function(){

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
            body:{userInfo:{uri: 'user/93'}, id: 93},
            status:httpStatusCode.OK
          });
        }
      };
    });

    testSession.get('/login')
        .set('Content-Type', 'application/json')
        .query({
          account: 'hahaha@haha.com',
          password: '99999999'
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

  it('can initialize quizzes', function (done) {
    testSession
        .get('/user-initialization/initializeQuizzes')
        .set('Content-Type', 'application/json')
        .expect(httpStatusCode.OK)
        .end(function(err, res) {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });

  });

});


