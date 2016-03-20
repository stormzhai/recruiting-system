'use strict';

var express = require('express');
var router = express.Router();
var request = require('superagent');
var async = require('async');
var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');

var redisData = {
  "redis": "connecting..."
};

function getRedisInfo(done) {
  done(null, redisData);
}

function getHookInfo(done) {
  done(null, {
    "hook-server": "unknown"
  });
}

var CIURL = config.CIServer + '/job/' + config.jobName + '/api/json';

function getCIInfo(done) {
  console.log("+++++++++++");
  request.get(CIURL)
      .timeout(1000)
      .end(function(err, resp) {
        console.log("=================");
        console.log(err);
        var data = {
          "ci-server": "connected"
        };
        if(err) {
          data = {
            "ci-server": err
          }
        }
        done(null, data);
      })
}

router.get('/', function (req, res) {
  var data = {"task-queue": "connected"};
  async.parallel([
    getHookInfo,
    getRedisInfo,
    getCIInfo
  ], function(err, result) {
    result.forEach(function(v) {
      data = Object.assign(data, v);
    });
    res.send(data);
  });
});

process.on('uncaughtException', function (err) {
  redisData['redis'] = err;
  console.log(err);
});

module.exports = router;