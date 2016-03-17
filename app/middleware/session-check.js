'use strict';

var getJumpControl = require('../mixin/get-jump-control');
var logicPuzzle = require('../models/logic-puzzle');
var superagent = require('superagent');
var yamlConfig = require('node-yaml-config');
var apiServer = yamlConfig.load('./config/config.yml').apiServer;
var async = require('async');

function pathControl(url, data) {
  var arr = url.split('/');

  arr.forEach(function (item, i) {
    arr[i] = item.split('?')[0];
  });

  var lastElement = arr[arr.length - 1];

  var redirectionAddress;
  var needRedirect = false;
  var jumpControl = getJumpControl(data);

  jumpControl.forEach((item) => {
    if (~item.originPath.indexOf(lastElement) && item.condition) {
      redirectionAddress = item.targetPath;
      needRedirect = true;
    }
  });

  return {
    needRedirect: needRedirect,
    targetPath: redirectionAddress
  };
}

module.exports = function (req, res, next) {
  var userId;

  if (req.headers.stress) {
    req.session.user = {
      id: 1,
      userInfo: {uri: 'users/1'},
      token: '846cd0e6d5dae4170381b6e61858c6b1'
    };
  }

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
        logicPuzzle.isPaperCommited(userId, (err, data) => {
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
    },

    isThirdParty: function (done) {
      done(null, Boolean(req.session.passport));
    }

  }, function (err, data) {
    var result = pathControl(req.url, data);

    if (result.needRedirect) {
      res.redirect(result.targetPath);
    } else {
      next();
    }
  });
};