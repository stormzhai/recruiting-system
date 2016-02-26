'use strict';

var Reflux = require('reflux');
var StartActions = require('../../actions/start/start-actions');
var superAgent = require('superagent');
var page = require('page');
var errorHandler = require('../../../../tools/error-handler');
var constant = require('../../../../mixin/constant');

var StartStore = Reflux.createStore({
  listenables: [StartActions],

  onAgreeDeal:function(isAgreed) {
    superAgent.put('/logic-puzzle/dealAgree')
      .set('Content-type', 'application/json')
      .send({
        dealAgree: isAgreed
      })
      .use(errorHandler)
      .end((err, req) => {
        if(req.body.status === constant.httpCode.OK) {
          page('logic-puzzle.html');
        }else {
          console.log('please agree the deal');
        }
      });
  }
});

module.exports = StartStore;
