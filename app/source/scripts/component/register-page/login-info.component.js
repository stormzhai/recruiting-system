'use strict';


var LoginActions = require('../../actions/register-page/login-actions');
var LoginStore = require('../../store/register-page/login-store');
var Reflux = require('reflux');

var LoginInfo = React.createClass({
  mixins: [Reflux.connect(LoginStore)],

  getInitialState: function (){
    return {
      isLoginState: false
    };
  },

  toggleState: function () {
    LoginActions.changeState(this.state.isLoginState);
  },

  render: function () {

    var passwordRetrieve = 'password-retrieve ' + (this.state.isLoginState ? '' : 'hide');

    return (
        <div id="login-info" className="col-md-5 register-form-right">
          <div id="register-right" className="link">
            {this.state.isLoginState ? '还没账号?' : '已有账号?'}
            <a id="change-to-logon" href="#" onClick={this.toggleState}>
              {this.state.isLoginState ? '立即注册' : '立即登录'}
            </a>
          </div>
          <div className={passwordRetrieve}>
            忘记密码?<a href="password-retrieve.html">立即找回</a>
          </div>
        </div>
    );
  }
});

module.exports = LoginInfo;


