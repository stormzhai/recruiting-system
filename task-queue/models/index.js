'use strict';

var redis = require('redis');
var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');

var client = (function() {
  var instance;

  function init () {
    return redis.createClient({
      host: config.redisServerIp,
      port: config.redisServerPort
    });
  }

  return !instance ? init() : instance;
})();

module.exports = client;