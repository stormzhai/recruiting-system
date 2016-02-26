'use strict';

var express = require('express');
var router = express.Router();
var request = require('superagent');
var constant = require('../../mixin/back-constant');
var async = require('async');
var validate = require('validate.js');
var md5 = require('js-md5');
var constraint = require('../../mixin/register-constraint');
var apiRequest = require('../../services/api-request');

function checkRegisterInfo(registerInfo) {
  var pass = true;

  var valObj = {};
  valObj.email = registerInfo.email;
  valObj.mobilePhone = registerInfo.mobilePhone;
  valObj.password = registerInfo.password;

  var result = validate(valObj, constraint);

  if (result !== undefined) {
    pass = false;
  }

  if (registerInfo.password.length < constant.PASSWORD_MIN_LENGTH ||
      registerInfo.password.length > constant.PASSWORD_MAX_LENGTH) {
    pass = false;
  }
  return pass;
}

router.post('/', function (req, res) {
  var registerInfo = req.body;
  var result = {};
  result.data = {};

  if (checkRegisterInfo(registerInfo)) {
    var isMobilePhoneExist;
    var isEmailExist;

    async.waterfall([
      (done)=> {
        apiRequest.get('users', {field: 'mobilePhone', value: registerInfo.mobilePhone}, function (err, resp) {
          if (!err) {
            isMobilePhoneExist = true;
          }
          done(null, resp);
        });
      },
      (data, done) => {
        apiRequest.get('users', {field: 'email', value: registerInfo.email}, function (err, resp) {
          if (!err) {
            isEmailExist = true;
          }
          if (isMobilePhoneExist || isEmailExist) {
            done(true, resp);
          }
          done(null, resp);
        });
      },
      (data, done)=> {
        registerInfo.password = md5(registerInfo.password);
        apiRequest.post('register', registerInfo, done);
      },
      (data, done)=> {
        if (data.body.id) {
          req.session.user = {
            id: data.body.id,
            userInfo: data.body.userInfo
          };
        }
        done(null, data);
      }
    ], (err,data) => {
      if (err === true) {
        res.send({
          status: constant.FAILING_STATUS,
          message: constant.EXIST,
          data: {
            isEmailExist: isEmailExist,
            isMobilePhoneExist: isMobilePhoneExist
          }
        });
      } else if (!err) {
        res.send({
          status: data.status,
          message: constant.REGISTER_SUCCESS
        });
      } else {
        res.send({
          message: constant.REGISTER_FAILED,
          status: constant.SERVER_ERROR
        });
      }
    });
  }
});

router.get('/validate-mobile-phone', function (req, res) {
  apiRequest.get('users', {field: 'mobilePhone', value: req.query.mobilePhone}, function (err, result) {
    if (result.body.uri) {
      res.send({
        status: constant.SUCCESSFUL_STATUS
      });
    } else {
      res.send({
        status: constant.FAILING_STATUS
      });
    }
  });
});

router.get('/validate-email', function (req, res) {
  apiRequest.get('users', {field: 'email', value: req.query.email}, function (err, result) {
    if (result.body.uri) {
      res.send({
        status: constant.SUCCESSFUL_STATUS
      });
    } else {
      res.send({
        status: constant.FAILING_STATUS
      });
    }
  });
});
module.exports = router;