/*eslint no-magic-numbers: 0*/
'use strict';

var superAgent = require('superagent');
var githubUser = require('../config/github-user.json');

function Vendor() {

}

Vendor.prototype.getBranches = function (req, res) {
  var originUrl = req.query.url;
  var list = originUrl.split('/');
  var apiUrl = 'https://api.github.com/repos/' + list[3] + '/' + list[4] + '/branches';
  superAgent.get(apiUrl)
      .set('Content-Type', 'application/json')
      .set(githubUser.header, githubUser.value)
      .end((err, result) => {
        if (result.body.message === 'Not Found') {
          res.send({message: 'Not Found'});
        } else {
          res.send({message: 'Succeed', data: result.body});
        }
      });
};

module.exports = Vendor;