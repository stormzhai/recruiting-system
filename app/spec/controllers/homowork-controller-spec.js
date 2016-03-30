'use strict';

var HomeworkController = require('../../controllers/homework-controller');
var userHomeworkQuizzes = require('../../models/user-homework-quizzes');
var homeworkInfo = require('../../models/homework-info');
var constant = require('../../mixin/constant');
var apiRequest = require('../../services/api-request');
var request = require('superagent');

var noop = function () {
};

describe('HomeworkController', function () {
  describe('getList', () => {
    var controller;

    beforeEach(function () {
      controller = new HomeworkController();
    });

    it('should return homeworkQuizzes when receive a request', function (done) {

      spyOn(userHomeworkQuizzes, 'unlockNext').and.callFake(function (id, done) {
        done(null, null);
      });

      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function (id, done) {

        var data = {
          userId: 1,
          quizzes: [
            {
              id: 1,
              status: constant.homeworkQuizzesStatus.ACTIVE

            }, {
              id: 2,
              status: constant.homeworkQuizzesStatus.LOCKED
            }
          ],
          save: (done) => {
            done(null, null);
          }
        };

        done(null, data);
      });

      controller.getList({
        session: {
          user: {id: 1}
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.OK,
            homeworkQuizzes: [
              {
                status: constant.homeworkQuizzesStatus.ACTIVE
              },
              {
                status: constant.homeworkQuizzesStatus.LOCKED
              }
            ]
          });
          done();
        }
      });

    });

    it('should active the first homeworkQuiz when all homeworkQuizzes is locked ', function (done) {

      spyOn(userHomeworkQuizzes, 'unlockNext').and.callFake(function (id, done) {
        var data = {
          userId: 1,
          quizzes: [
            {
              id: 1,
              status: constant.homeworkQuizzesStatus.ACTIVE

            }, {
              id: 2,
              status: constant.homeworkQuizzesStatus.LOCKED
            }
          ]
        };
        done(null, data);
      });

      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function (id, done) {

        var data = {
          userId: 1,
          quizzes: [
            {
              id: 1,
              status: constant.homeworkQuizzesStatus.ACTIVE

            }, {
              id: 2,
              status: constant.homeworkQuizzesStatus.LOCKED
            }
          ],
          save: (done) => {
            done(null, null);
          }
        };

        done(null, data);
      });

      controller.getList({
        session: {
          user: {id: 1}
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.OK,
            homeworkQuizzes: [
              {
                status: constant.homeworkQuizzesStatus.ACTIVE
              },
              {
                status: constant.homeworkQuizzesStatus.LOCKED
              }
            ]
          });
          done();
        }
      });
    });
  });

  describe('getQuiz', () => {
    var controller;

    beforeEach(function () {
      controller = new HomeworkController();

      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function (id, done) {
        var data = {
          userId: 1,
          save: function () {
          },
          quizzes: [
            {
              id: 1,
              status: constant.homeworkQuizzesStatus.ACTIVE,
              homeworkSubmitPostHistory: [{
                status: constant.homeworkQuizzesStatus.ACTIVE,
                homeworkURL: 'w',
                branch: 'dev'
              }]
            }, {
              id: 2,
              status: constant.homeworkQuizzesStatus.LOCKED
            }, {
              id: 3,
              status: constant.homeworkQuizzesStatus.LOCKED
            }
          ]
        };

        done(null, data);
      });

      spyOn(userHomeworkQuizzes, 'unlockNext').and.callFake(function (id, done) {
        done(null, null);
      });

    });

    it('should return quiz and statusCode: 200 when receive a request', (done) => {

      spyOn(apiRequest, 'get').and.callFake(function (url, callback) {
        var data = {
          body: {
            id: 1,
            description: '这是一道简单的题',
            templateRepository: 'www.github.com'
          }
        };
        callback(null, data);
      });

      controller.getQuiz({
        session: {user: {id: 1}},
        query: {orderId: 1}
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.OK,
            quiz: {
              quizStatus: constant.homeworkQuizzesStatus.ACTIVE,
              desc: '这是一道简单的题',
              templateRepo: 'www.github.com',
              userAnswerRepo: 'w',
              branch: 'dev'
            }
          });
          done();
        },
        status: noop
      });
    });

    it('should return statusCode: 403 when request quiz is locked', (done) => {

      controller.getQuiz({
        session: {user: {id: 1}},
        query: {orderId: 3}
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.FORBIDDEN
          });
          done();
        },
        status: noop

      });
    });
  });

  describe('saveGithubUrl', ()=> {

    var controller;
    var lockedData;
    var activeData;
    var progressData;
    var successData;
    var errorData;

    beforeEach(()=> {
      controller = new HomeworkController();
      lockedData = {
        userId: 1,
        quizzes: [
          {
            id: 1,
            status: constant.homeworkQuizzesStatus.LOCKED,
            userAnswerRepo: 'www.github.com'
          }
        ]
      };

      activeData = {
        userId: 1,
        quizzes: [
          {
            id: 1,
            status: constant.homeworkQuizzesStatus.ACTIVE,
            userAnswerRepo: 'www.github.com'
          }
        ]
      };

      progressData = {
        userId: 1,
        quizzes: [
          {
            id: 1,
            status: constant.homeworkQuizzesStatus.PROGRESS,
            userAnswerRepo: 'www.github.com'
          }
        ]
      };

      successData = {
        userId: 1,
        quizzes: [
          {
            id: 1,
            status: constant.homeworkQuizzesStatus.SUCCESS,
            userAnswerRepo: 'www.github.com'
          }
        ]
      };

      errorData = {
        userId: 1,
        quizzes: [
          {
            id: 1,
            status: constant.homeworkQuizzesStatus.ERROR,
            userAnswerRepo: 'www.github.com'
          }
        ]
      };

    });


    it('it should return false when the specific homework is locked ', (done)=> {

      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function (userId, callback) {
        callback(null, lockedData);
      });

      userHomeworkQuizzes.checkDataForSubmit(1, 1, function (err, result) {
        expect(result).toEqual({
          data: {
            userId: 1,
            quizzes: [
              {
                id: 1,
                status: constant.homeworkQuizzesStatus.LOCKED,
                userAnswerRepo: 'www.github.com'
              }]
          },
          status: constant.httpCode.FORBIDDEN,
          isValidate: false
        });
        done();
      });

    });


    it('it should return true when the specific homework is active ', (done)=> {
      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function (userId, callback) {
        callback(null, activeData);
      });

      userHomeworkQuizzes.checkDataForSubmit(1, 1, function (err, result) {
        expect(result).toEqual({
          data: {
            userId: 1,
            quizzes: [
              {
                id: 1,
                status: constant.homeworkQuizzesStatus.ACTIVE,
                userAnswerRepo: 'www.github.com'
              }]
          },
          status: constant.httpCode.OK,
          isValidate: true
        });
        done();
      });
    });

    it('it should return  false when the specific homework is progress', (done)=> {
      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function (userId, callback) {
        callback(null, progressData);
      });

      userHomeworkQuizzes.checkDataForSubmit(1, 1, function (err, result) {
        expect(result).toEqual({
          data: {
            userId: 1,
            quizzes: [
              {
                id: 1,
                status: constant.homeworkQuizzesStatus.PROGRESS,
                userAnswerRepo: 'www.github.com'
              }]
          },
          status: constant.httpCode.FORBIDDEN,
          isValidate: false
        });
        done();
      });
    });

    it('it should return false when the specific homework is is success', (done)=> {

      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function (userId, callback) {
        callback(null, successData);
      });

      userHomeworkQuizzes.checkDataForSubmit(1, 1, function (err, result) {
        expect(result).toEqual({
          data: {
            userId: 1,
            quizzes: [
              {
                id: 1,
                status: constant.homeworkQuizzesStatus.SUCCESS,
                userAnswerRepo: 'www.github.com'
              }]
          },
          status: constant.httpCode.FORBIDDEN,
          isValidate: false
        });
        done();
      });

    });

    it('it should return true when the specific homework is error', (done)=> {

      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function (userId, callback) {
        callback(null, errorData);
      });

      userHomeworkQuizzes.checkDataForSubmit(1, 1, function (err, result) {
        expect(result).toEqual({
          data: {
            userId: 1,
            quizzes: [
              {
                id: 1,
                status: constant.homeworkQuizzesStatus.ERROR,
                userAnswerRepo: 'www.github.com'
              }]
          },
          status: constant.httpCode.OK,
          isValidate: true
        });
        done();
      });

    });

    it('it should return status 200 when change status to progress and  save userAnswerUrl success', (done)=> {

      spyOn(userHomeworkQuizzes, 'checkDataForSubmit').and.callFake(function (userId, orderId, callback) {

        var result = {
          data: {
            userId: 1,
            quizzes: [
              {
                id: 1,
                status: constant.homeworkQuizzesStatus.ACTIVE,
                userAnswerRepo: 'www.repo.com',
                homeworkSubmitPostHistory: []
              }],
            save: (done) => {
              done(null, 1, true);
            }
          },
          isValidate: true
        };
        callback(null, result);
      });

      spyOn(homeworkInfo, 'create').and.callFake(function (data, callback) {
        var data = {
          _id: '56fa42a05a20a97b25870a8d',
          userId: 1,
          homeworkId: 2
        };
        callback(null, data);
      });

      spyOn(apiRequest, 'get').and.callFake(function (url, callback) {
        var data = {
          body: {
            id: 1,
            description: '这是一道简单的题',
            templateRepository: 'www.github.com',
            evaluateScript: 'www.github.com'
          }
        };
        callback(null, data);
      });

      spyOn(request, 'post').and.callFake(function () {
        return {
          set: function () {
            return this;
          },
          send: function () {
            return this;
          },
          end: function (fn) {
            fn(null, {
              status: constant.httpCode.OK
            });
          }
        };
      });

      controller.saveGithubUrl({
        session: {user: {id: 1}},
        body: {
          userAnswerRepo: 'www.repo.com',
          orderId: 1,
          branch: 'dev'
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.OK
          });
          done();
        },
        status: noop
      });
    });

    it('it should return status 404 when orderId is out of range ', (done)=> {
      spyOn(userHomeworkQuizzes, 'checkDataForSubmit').and.callFake(function (userId, orderId, callback) {
        var result = {
          data: {
            userId: 1,
            quizzes: [
              {
                id: 1,
                status: constant.homeworkQuizzesStatus.ACTIVE,
                userAnswerRepo: 'www.repo.com'
              }],
            save: (done) => {
              done(null, true);
            }
          },
          isValidate: false,
          status: constant.httpCode.NOT_FOUND
        };
        callback(null, result);
      });

      controller.saveGithubUrl({
        session: {user: {id: 1}},
        body: {
          userAnswerRepo: 'www.repo.com',
          orderId: 121
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.NOT_FOUND
          });
          done();
        },
        status: noop
      });

    });

    it('it should return status 403  when do not save userAnswerUrl', (done)=> {
      spyOn(userHomeworkQuizzes, 'checkDataForSubmit').and.callFake(function (userId, orderId, callback) {

        var data = {
          data: {
            userId: 1,
            quizzes: [
              {
                id: 1,
                status: constant.homeworkQuizzesStatus.ACTIVE,
                userAnswerRepo: 'www.repo.com'
              }],
            save: (done) => {
              done(null, true);
            }
          },
          isValidate: false,
          status: constant.httpCode.FORBIDDEN

        };
        callback(null, data);
      });

      controller.saveGithubUrl({
        session: {user: {id: 1}},
        body: {
          userAnswerRepo: 'www.repo.com',
          orderId: 2
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.FORBIDDEN
          });
          done();
        },
        status: noop
      });
    });
  });

  describe('updateResult', () => {
    var controller;

    beforeEach(()=> {
      controller = new HomeworkController();

      spyOn(apiRequest, 'post').and.callFake(function (url, data, callback) {
        callback(null);
      });

      spyOn(userHomeworkQuizzes, 'checkDataForUpdate').and.callFake(function (userId, homeworkId, callback) {
        callback(null, true);
      });

      spyOn(userHomeworkQuizzes, 'updateQuizzesStatus').and.callFake(function (data, callback) {
        callback(null, true, true);
      });

      spyOn(userHomeworkQuizzes, 'unlockNext').and.callFake(function (userId, callback) {
        callback(null, true, true);
      });
    });

    it('should return 200 when save the result success', (done) => {
      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function (data, selecter, callback) {
        callback(null, {
          paperId: 1,
          quizzes: [{
            startTime: '11111111',
            homeworkSubmitPostHistory: {}
          }]
        });
      });

      controller.updateResult({
        body: {
          userId: 2,
          homeworkId: 1,
          resultStatus: 5
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.OK
          });
          done();
        }
      });
    });

    it('should return 500 when something was wrong', (done) => {
      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function (data, selecter, callback) {
        callback(true, {
          paperId: 1,
          quizzes: [{
            startTime: '11111111',
            homeworkSubmitPostHistory: {}
          }]
        });
      });

      controller.updateResult({
        body: {
          userId: 2,
          homeworkId: 1,
          resultStatus: 5
        }
      }, {
        sendStatus: function (data) {
          expect(data).toEqual(constant.httpCode.INTERNAL_SERVER_ERROR);
          done();
        }
      });
    });

  });
});
