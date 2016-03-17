'use strict';

var session = require('supertest-session');
var app = require('../../app');
var request = require('../../services/api-request');
var httpStatusCode = require('../../mixin/constant').httpCode;

var testSession = null;

describe('GET /initializeQuizzes', function(){

  it('can sign in', function(done){

    testSession = session(app);

    spyOn(request, 'post').and.callFake(function(url,body,callback) {
      callback(null,{
        body: {userInfo: {uri: 'user/1'}, id: 1},
        status: httpStatusCode.OK,
        headers:'yes'
      });
    });

    testSession.post('/login')
        .set('Content-Type', 'application/json')
        .send({
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


