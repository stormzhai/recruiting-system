'use strict';

var Reflux = require('reflux');
var NavigationActions = require('../../actions/navigation/navigation-actions');
var request = require('superagent');
var errorHandler = require('../../../../tools/error-handler');
var constant = require('../../../../mixin/constant');


var NavigationStore = Reflux.createStore({
  listenables: [NavigationActions],

  onLoadAccount:function() {
    request.get('/navigation')
        .set('Content-Type', 'application/json')
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            return;
          } else if (res.body.status === constant.httpCode.OK) {
            this.trigger({account: res.body.account});
          } else {
            return;
          }
        });
  }
});

module.exports = NavigationStore;
