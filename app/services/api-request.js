'use strict';

var superAgent = require('superagent');
var yamlConfig = require('node-yaml-config');
var apiServer = yamlConfig.load('./config/config.yml').apiServer;

var apiRequest = {
  get: function (url, query, callback) {

    if ('function' === typeof query) {
      callback = query;
      query = {};
    }

    superAgent.get(apiServer + url)
        .set('Content-Type', 'application/json')
        .query(query)
        .end(callback);
  },

  post: function (url, body, callback) {

    superAgent.post(apiServer + url)
        .set('Content-Type', 'application/json')
        .send(body)
        .end(callback);
  },

  put: function (url, data ,callback) {

    superAgent.put(apiServer + url)
        .set('Content-Type', 'application/json')
        .send(data)
        .end(callback);
  }
};

module.exports = apiRequest;
