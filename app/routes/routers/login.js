'use strict';

var express = require('express');
var router = express.Router();
var request = require('superagent');
var constant = require('../../mixin/back-constant');
var md5 = require('js-md5');
var validate = require('validate.js');
var constraint = require('../../mixin/login-constraint');
var passport = require('passport');
var apiRequest = require('../../services/api-request');


function checkLoginInfo(account, password) {
  var pass = true;
  var valObj = {};

  valObj.phoneEmail = account;
  valObj.loginPassword = password;
  var result = validate(valObj, constraint);

  if (result !== undefined) {
    pass = false;
  }

  if (password.length < constant.PASSWORD_MIN_LENGTH ||
      password.length > constant.PASSWORD_MAX_LENGTH) {
    pass = false;
  }
  return pass;
}

router.get('/', function (req, res) {
  var account = req.query.account;
  var password = req.query.password;

  if (!checkLoginInfo(account, password)) {
    res.send({
      message: constant.LOGIN_FAILED,
      status: 403
    });
  } else {
    password = md5(password);

    apiRequest.post('login', {email: account, password: password}, function (err, result) {
      if (result.body.id) {
        req.session.user = {
          id: result.body.id,
          userInfo: result.body.userInfo
        };
      }
      res.send({
        status: result.status
      });
    });
  }
});

module.exports = router;
