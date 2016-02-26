'use strict';

var getJumpControl = require('../mixin/get-jump-control');
var logicPuzzle = require('../models/logic-puzzle');
var superagent = require('superagent');
var yamlConfig = require('node-yaml-config');
var apiServer = yamlConfig.load('./config/config.yml').apiServer;
var async = require('async');

function pathControl(req, res, next, jumpControl) {
  var arr = req.url.split('/');

  arr.forEach(function (item, i) {
    arr[i] = item.split('?')[0];
  });

  var lastElement = arr[arr.length - 1];

  var redirectionAddress;
  var needRedirect = false;

  jumpControl.forEach((item) => {
    if (~item.originPath.indexOf(lastElement) && item.condition) {
      redirectionAddress = item.targetPath;
      needRedirect = true;
    }
  });

  if (needRedirect) {
    res.redirect(redirectionAddress);
  } else {
    next();
  }
}

module.exports = function (req, res, next) {
  var userId;

  if (Boolean(req.session.user)) {
    userId = req.session.user.id;
  }

  async.parallel({
    isLoged: function (done) {
      done(null, Boolean(req.session.user));
    },

    isPaperCommited: function (done) {
      if (!userId) {
        done(null, false);
      } else {
        logicPuzzle.isPaperCommited(userId, (data) => {
          done(null, data);
        });
      }
    },

    isDetailed: function (done) {
      if (!userId) {
        done(null, false);
      } else {
        superagent.get(apiServer + 'users/' + userId + '/detail')
            .set('Content-Type', 'application/json')
            .end(function (err) {
              if (err) {
                done(null, false);
              } else {
                done(null, true);
              }
            });
      }
    },

    isAgreed: function (done) {
      logicPuzzle.isDealAgree(userId, (data) => {
        done(null, data);
      });
    }

  }, function (err, data) {
    var jumpControl = getJumpControl(data);

    pathControl(req, res, next, jumpControl);
  });
};