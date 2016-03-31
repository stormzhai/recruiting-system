/*eslint no-magic-numbers: 0*/

'use strict';

var TaskController = require('../../controllers/task-controller');
var request = require('superagent');
var httpCode = require('../../mixin/constant').httpCode;
var UserHomeworkQuizzes = require('../../models/user-homework-quizzes');
var UserHomeworkAnswer = require('../../models/user-homework-answer');

describe('TaskController', function () {
  describe('createTask', function () {
    var taskController;

    beforeEach(function() {
      taskController = new TaskController();

      spyOn(UserHomeworkAnswer, 'updateStatus').and.callFake(function (uniqId, status, callback) {
        callback(null, {
          _id : '56fcb384ce13ab8368c378ae',
          homeworkURL : 'https://github.com/Lucky-LengYi/pre-pos-test',
          status : 6,
          version : 'a8858e33b01f05e90a6b832be215e5f9abb70844',
          branch : 'master',
          commitTime : 1.4594e+09,
        }, 0);
      });
    });

    it('create ci task when receive a request', function (done) {

      spyOn(request, 'post').and.callFake(function () {
        return {
          set: function () {
            return this;
          },
          send: function () {
            return this;
          },
          query: function () {
            return this;
          },
          end: function (callback) {
            callback(null, {
              status: httpCode.OK
            });
          }
        };
      });

      taskController.createTask({
        body: {
          userId:1,
          homeworkId:1,
          userAnswerRepo: 'https://github.com/thoughtworks-academy/recruiting-system-task-queue',
          evaluateScript: 'http://10.29.3.221:8888/fs/homework-script/check-readme.sh',
          callbackURL: 'http://localhost:3000/homework/result',
          branch: 'master'
        }
      },{
        sendStatus: function(status) {
          expect(status).toEqual(httpCode.INTERNAL_SERVER_ERROR);
          done();
        },
        send: function(data) {
          expect(data).toEqual({
            status: httpCode.OK
          });
          done();
        }
      });
    });

    it('return 500 when something was wrong', function (done) {

      spyOn(request, 'post').and.callFake(function () {
        return {
          set: function () {
            return this;
          },
          send: function () {
            return this;
          },
          query: function () {
            return this;
          },
          end: function (callback) {
            callback('error');
          }
        };
      });

      taskController.createTask({
        body: {
          userId: 1,
          homeworkId: 1,
          userAnswerRepo: 'https://github.com/thoughtworks-academy/recruiting-system-task-queue',
          evaluateScript: 'http://10.29.3.221:8888/fs/homework-script/check-readme.sh',
          callbackURL: 'http://localhost:3000/homework/result',
          branch: 'master'
        }
      },{
        sendStatus: function(status) {
          expect(status).toEqual(httpCode.INTERNAL_SERVER_ERROR);
          done();
        },
        send: function(data) {
          expect(data).toEqual({
            status: httpCode.OK
          });
        }
      });
    });

  });

  describe('result', function () {
    var taskController;

    beforeEach(function() {
      taskController = new TaskController();

      spyOn(UserHomeworkAnswer, 'updateStatus').and.callFake(function (uniqId, status, callback) {
        callback(null, {
          _id : '56fcb384ce13ab8368c378ae',
          homeworkURL : 'https://github.com/Lucky-LengYi/pre-pos-test',
          status : 6,
          version : 'a8858e33b01f05e90a6b832be215e5f9abb70844',
          branch : 'master',
          commitTime : 1.4594e+09,
        }, 0);
      });

      spyOn(UserHomeworkAnswer, 'writeResult').and.callFake(function (uniqId, status, callback) {
        callback(null, {
          _id : '56fcb384ce13ab8368c378ae',
          homeworkURL : 'https://github.com/Lucky-LengYi/pre-pos-test',
          status : 4,
          version : 'a8858e33b01f05e90a6b832be215e5f9abb70844',
          branch : 'master',
          commitTime : 1.4594e+09,
          homeworkDetail: 'cmVhZG1lLm1kIOacquaJvuWIsC7or7fms6jmhI/mlofku7blkI3lpKflsI/lhpkhCg=='
        }, 0);
      });

      spyOn(UserHomeworkQuizzes, 'findQuizInfo').and.callFake(function (uniqId, callback) {
        callback(null, {
          quizzes:[{
            homeworkSubmitPostHistory: [{
              _id: '56fceb055276b36f77a49514',
              homeworkURL: 'https://github.com/sialvsic/thousands_separators_answer',
              status: 4,
              version: '51a7127ffd1a4588c8216d4f36e9ba3316fd267c',
              branch: 'master',
              commitTime: 1459415813,
              homeworkDetail: 'Q2xvbmluZyBpbnRvICd0aG91c2FuZHNfc2VwYXJhdG9ycycuLi4KU3RhcnRlZAouLi4uLi4KCgo2IHNwZWNzLCAwIGZhaWx1cmVzCkZpbmlzaGVkIGluIDAuMDA5IHNlY29uZHMK'
            }],
            startTime: 1459415638,
            _id: '56fcea53a3fb7eb17835da5d',
            uri: 'homeworkQuizzes/1',
            id: 1
          }],
          paperId: 1,
          userId: 2,
          _id: '56fcea53a3fb7eb17835da53'
        });
      });
    });

    it('should return 200 when write result in mongodb', function (done) {

      spyOn(request, 'post').and.callFake(function () {
        return {
          set: function () {
            return this;
          },
          send: function () {
            return this;
          },
          query: function () {
            return this;
          },
          end: function (callback) {
            callback(null, {
              status: httpCode.OK
            });
          }
        };
      });

      taskController.result({
        params: {
          uniqId: '51a7127ffd1a4588c8216d4f36e9ba3316fd267c'
        },
        body: {
          result: 4,
          resultDetail: 'cmVhZG1lLm1kIOaJvuWIsC4K'
        }
      },{
        sendStatus: function(status) {
          expect(status).toEqual(httpCode.INTERNAL_SERVER_ERROR);
          done();
        },
        send: function(data) {
          expect(data).toEqual({
            status: httpCode.OK
          });
          done();
        }
      });
    });

    it('should request api when answer is right', function (done) {

      spyOn(request, 'post').and.callFake(function () {
        return {
          set: function () {
            return this;
          },
          send: function () {
            return this;
          },
          query: function () {
            return this;
          },
          end: function (callback) {
            callback('error');
          }
        };
      });

      taskController.result({
        params: {
          uniqId: '51a7127ffd1a4588c8216d4f36e9ba3316fd267c'
        },
        body: {
          result: 4,
          resultDetail: 'cmVhZG1lLm1kIOaJvuWIsC4K'
        }
      },{
        sendStatus: function(status) {
          expect(status).toEqual(httpCode.INTERNAL_SERVER_ERROR);
          done();
        },
        send: function(data) {
          expect(data).toEqual({
            status: httpCode.OK
          });
        }
      });
    });

    it('return 500 when something was wrong', function (done) {

      spyOn(request, 'post').and.callFake(function () {
        return {
          set: function () {
            return this;
          },
          send: function () {
            return this;
          },
          query: function () {
            return this;
          },
          end: function (callback) {
            callback('error');
          }
        };
      });

      taskController.result({
        params: {
          uniqId: '51a7127ffd1a4588c8216d4f36e9ba3316fd267c'
        },
        body: {
          result: 4,
          resultDetail: 'cmVhZG1lLm1kIOaJvuWIsC4K'
        }
      },{
        sendStatus: function(status) {
          expect(status).toEqual(httpCode.INTERNAL_SERVER_ERROR);
          done();
        },
        send: function(data) {
          expect(data).toEqual({
            status: httpCode.OK
          });
        }
      });
    });

  });

  describe('status', function () {
    var taskController;

    beforeEach(function() {
      taskController = new TaskController();
    });

    it('should return 200 when everythins is ok', function (done) {
      spyOn(request, 'get').and.callFake(function () {
        return {
          end: function (callback) {
            var result = {
              body :{
                discoverableItems: [],
                items: [],
                assignedLabels: [{
                  busyExecutors: 0,
                  idleExecutors: 8,
                  totalExecutors: 8
                }]
              }
            };

            callback(null, result);
          }
        };
      });

      taskController.status({}, {
        sendStatus: function(status) {
          expect(status).toEqual(httpCode.INTERNAL_SERVER_ERROR);
          done();
        },
        send: function(data) {
          expect(data).toEqual({
            busyExecutors: 0,
            idleExecutors: 8,
            totalExecutors: 8,
            awaitTask: 0
          });
          done();
        }
      });
    });
    it('should return 500 when CI has error', function (done) {
      spyOn(request, 'get').and.callFake(function () {
        return {
          end: function (callback) {
            callback(true);
          }
        };
      });

      taskController.status({}, {
        sendStatus: function(status) {
          expect(status).toEqual(httpCode.INTERNAL_SERVER_ERROR);
          done();
        },
        send: function(data) {
          expect(data).toEqual({
            status: httpCode.OK
          });
        }
      });
    });
  });
});
