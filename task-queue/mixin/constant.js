'use strict';

var constant = {
  httpCode: {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
    FORBIDDEN:403,
    INTERNAL_SERVER_ERROR: 500
  },
  time: {
    MINUTE_PER_HOUR: 60,
    SECONDS_PER_MINUTE: 60,
    MILLISECOND_PER_SECONDS: 1000
  },
  homeworkQuizzesStatus:{
    LOCKED:1,
    ACTIVE:2,
    PROGRESS:3,
    SUCCESS:4,
    ERROR:5,
    LINE_UP:6
  },
  changePassword: {
    ERROR: '旧密码错误',
    SERVERERROR: '服务器错误'
  }
};

module.exports = constant;
