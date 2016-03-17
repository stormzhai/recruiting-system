'use strict';

exports.setRoutes = function (app) {
  app.use('/',require('./routers/index'));
  app.use('/register', require('./routers/register'));
  app.use('/logic-puzzle', require('./routers/logic-puzzle'));
  app.use('/login', require('./routers/login'));
  app.use('/start', require('./routers/start'));
  app.use('/user-detail', require('./routers/user-detail'));
  app.use('/dashboard', require('./routers/dashboard'));
  app.use('/logout', require('./routers/logout'));
  app.use('/timer', require('./routers/timer'));
  app.use('/user-initialization', require('./routers/user-initialization'));
  app.use('/homework',require('./routers/homework'));
  app.use('/password',require('./routers/password'));
  app.use('/user', require('./routers/user'));
  app.use('/paper', require('./routers/paper'));
};
