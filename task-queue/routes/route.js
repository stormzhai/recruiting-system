'use strict';

exports.setRoutes = function (app) {
  app.use('/tasks',require('./routers/tasks'));
};