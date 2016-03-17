'use strict';


var validate = require('validate.js');
var LoginActions = require('../../actions/register-page/login-actions');
var LoginStore = require('../../store/register-page/login-store');
var Reflux = require('reflux');
var constraint = require('../../../../mixin/login-constraint');
var page = require('page');
var constant = require('../../../../mixin/constant');

function getError(validateInfo, field) {
  if (validateInfo && validateInfo[field] && validateInfo[field].length > 0) {
    return validateInfo[field][0];
  }
  return '';
}

var LoginForm = React.createClass({
  mixins: [Reflux.connect(LoginStore)],

  getInitialState: function () {
    return {
      isLoginState: false,
      emailError: '',
      loginPasswordError: '',
      loginFailed: false,
      clickable: false,
      email: '',
      loginPassword: ''
    };
  },

  handleChange: function (event) {
    var value = event.target.value;
    var name = event.target.name;
    LoginActions.changeValue(name, value);
  },

  validate: function (event) {
    var target = event.target;
    var value = target.value;
    var name = target.name;
    var valObj = {};
    var result;
    var error;
    var stateObj = {};
    if (name === 'email') {
      valObj.email = value;
      valObj.mobilePhone = value;
      result = validate(valObj, constraint);
      error = getError(result, 'email');
      if (error) {
        error = getError(result, 'mobilePhone');
      }
    } else {
      valObj[name] = value;
      result = validate(valObj, constraint);
      error = getError(result, name);
    }
    stateObj[name + 'Error'] = error;
    this.setState(stateObj);
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.state.isLoginState && !prevState.isLoginState) {
      this.refs.email.value = '';
      this.refs.loginPassword.value = '';
      this.setState({
        emailError: '',
        loginPasswordError: '',
        loginFailed: false
      });
    }
  },


  login: function () {
    this.setState({
      clickable: true
    });

    var email = ReactDOM.findDOMNode(this.refs.email).value;
    var loginPassword = ReactDOM.findDOMNode(this.refs.loginPassword).value;
    LoginActions.login(email, loginPassword);
  },

  render: function () {
    var classString = 'col-md-7 logon-form-container' + (this.state.isLoginState ? '' : ' hide');
    return (
        <div id="logon" className={classString}>
          <h4 className="welcome">欢迎登陆思沃学院</h4>
          <div className={'lose' + (this.state.loginFailed === false ? ' hide' : '')} name="loginFailed">用户名或密码错误</div>
          <form action="">
            <div className="form-group">
              <input className="form-control" type="text" placeholder="请输入邮箱或手机号" name="email"
                     onBlur={this.validate}
                     ref="email"/>
              <div
                  className={'lose' + (this.state.emailError === '' ? ' hide' : '')}>{this.state.emailError}
              </div>
            </div>
            <div className="form-group">
              <input className="form-control" type="password" placeholder="请输入密码" name="loginPassword"
                     ref="loginPassword" onBlur={this.validate}/>
              <div
                  className={'lose' + (this.state.loginPasswordError === '' ? ' hide' : '')}>{this.state.loginPasswordError}
              </div>
            </div>
            <button type="button" id="login-btn" className="btn btn-lg btn-block btn-primary" onClick={this.login}
                    disabled={this.state.clickable}>登陆
              <i className={'fa fa-spinner fa-spin loading' + (this.state.clickable ? '' : ' hide')}/>
            </button>
          </form>
        </div>
    );
  }
});

module.exports = LoginForm;