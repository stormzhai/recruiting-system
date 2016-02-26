'use strict';
var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var async = require('async');

function LogoutController() {

}

LogoutController.prototype.logout = (req, res)=> {

  var logoutUri = 'logout';
  var body = {};

  async.waterfall([
    (done)=> {
      req.session.destroy(function (err) {
        if (err) {
          done(err, null);
        } else {
          done(null, null);
        }
      });
    }, (data, done) => {
      apiRequest.post(logoutUri, body, function (err, resp) {
        done(err, resp);
      });
    }
  ], (err, data) => {
    res.redirect('/register.html');
  });
};

module.exports = LogoutController;