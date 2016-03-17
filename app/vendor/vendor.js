/*eslint no-magic-numbers: 0*/
'use strict';

var superAgent = require('superagent');
var yamlConfig = require('node-yaml-config');
var gitHubToken = yamlConfig.load('./config/config.yml').gitHubToken;

function Vendor() {

}

Vendor.prototype.getBranches = function (req, res) {
  var originUrl = req.query.url;
  var list = originUrl.split('/');
  var user = list[3];
  var repo = list[4].replace(/.git/i,'');
  var apiUrl = 'https://api.github.com/repos/' + user + '/' + repo + '/branches';
  superAgent.get(apiUrl)
      .set('Content-Type', 'application/json')
      .set('Authorization', gitHubToken)
      .end((err, result) => {
        if (result.body.message === 'Not Found') {
          res.send({message: 'Not Found'});
        } else {
          res.send({message: 'Succeed', data: result.body});
        }
      });
};

module.exports = Vendor;