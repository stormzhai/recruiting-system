'use strict';

require('newrelic');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var route = require('./routes/route');
var webpack = require('webpack');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sessionCheck = require('./middleware/session-check');
var errRequestHandler = require('./middleware/errorRequestHandler');
var util = require('util');
var mongoConn = require('./services/mongo-conn');
var MongoStore = require('connect-mongo')(session);
var constant = require('./mixin/constant');
var yamlConfig = require('node-yaml-config');

var config = yamlConfig.load(__dirname + '/config/config.yml');

var env = ['production', 'test', 'staging'].indexOf(process.env.NODE_ENV) < 0 ? 'development' : process.env.NODE_ENV;



app.use(cookieParser());
app.use(session({
  secret: 'RECRUITING_SYSTEM', resave: false, saveUninitialized: false,
  store: new MongoStore({
    url: config.database,
    ttl: config.sessionTtl
  })
}));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(sessionCheck);

app.use(express.static('public/assets'));

route.setRoutes(app);

app.all('*', errRequestHandler);

app.listen(config.port, function () {
  console.log('Current environment is: ' + env);
  console.log('App listening at http://localhost:' + config.port);
  mongoConn.start(config.database);
});

module.exports = app;
