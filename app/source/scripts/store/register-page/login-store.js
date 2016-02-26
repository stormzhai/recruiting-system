'use strict';

var Reflux = require('reflux');
var LoginActions = require('../../actions/register-page/login-actions');
var request = require('superagent');
var constant = require('../../../../mixin/constant');
var page = require('page');
var errorHandler = require('../../../../tools/error-handler');


var LoginStore = Reflux.createStore({
  listenables: LoginActions,

  onLogin: function (phoneEmail, loginPassword){
    request.get('/login')
        .set('Content-Type', 'application/json')
        .query({
          account: phoneEmail,
          password: loginPassword
        })
        .use(errorHandler)
        .end((err, req) => {
          var data = JSON.parse(req.text);
          if (data.status === constant.httpCode.OK) {
            this.trigger({
              loginFailed : false
            });
            page('dashboard.html');
          } else {
            this.trigger({
              clickable: false,
              loginFailed : true
            });
          }
        });
  },

  onChangeState: function (isLoginState){
    this.trigger({
      isLoginState: !isLoginState,
      phoneEmailError: '',
      loginPasswordError: '',
      mobilePhoneError: '',
      emailError: '',
      passwordError: '',
      agree: false,
      passwordSafeStyle: '',
      passwordSafeLevel: '',
      password: '',
      email: '',
      mobilePhone: '',
      phoneEmail: '',
      loginPassword: '',
      isShowToggle: false
    });
  },

  onChangeValue: function (name, value){
    this.trigger({[name]: value});
  }

});

module.exports = LoginStore;