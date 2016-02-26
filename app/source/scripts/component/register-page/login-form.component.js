'use strict';

var React = global.React = require('react');
var validate = require('validate.js');
var ReactDOM = require('react-dom');
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
      phoneEmailError: '',
      loginPasswordError: '',
      loginFailed: false,
      clickable: false,
      phoneMail: '',
      loginPassword: ''
    };
  },

  handleChange: function (event){
    var value = event.target.value;
    var name = event.target.name;
    LoginActions.changeValue(name, value);
  },

  validate: function (event) {
    var target = event.target;
    var value = target.value;
    var name = target.name;
    var valObj = {};
    valObj[name] = value;

    var result = validate(valObj, constraint);
    var error = getError(result, name);
    var stateObj = {};

    stateObj[name + 'Error'] = error;
    this.setState(stateObj);
  },

  login: function () {
    this.setState({
      clickable: true
    });

    var phoneEmail = ReactDOM.findDOMNode(this.refs.phoneEmail).value;
    var loginPassword = ReactDOM.findDOMNode(this.refs.loginPassword).value;
    LoginActions.login(phoneEmail, loginPassword);
  },

  render: function () {
    var classString = 'col-md-7 logon-form-container' + (this.state.isLoginState ? '' : ' hide');

    return (
        <div id="logon" className={classString}>
          <h4 className="welcome">欢迎登陆思沃学院</h4>
          <div className={'lose' + (this.state.loginFailed === false ? ' hide' : '')} name="loginFailed">用户名或密码错误</div>
          <form action="">
            <div className="form-group">
              <input className="form-control" type="text" placeholder="请输入邮箱" name="phoneEmail" onBlur={this.validate}
                     ref="phoneEmail" onChange={this.handleChange} value={this.state.phoneEmail}/>
              <div
                  className={'lose' + (this.state.phoneEmailError === '' ? ' hide' : '')}>{this.state.phoneEmailError}
              </div>
            </div>
            <div className="form-group">
              <input className="form-control" type="password" placeholder="请输入密码" name="loginPassword"
                     ref="loginPassword" onBlur={this.validate} onChange={this.handleChange} value={this.state.loginPassword}/>
              <div
                  className={'lose' + (this.state.loginPasswordError === '' ? ' hide' : '')}>{this.state.loginPasswordError}
              </div>
            </div>
            <button type="button" id="login-btn" className="btn btn-lg btn-block btn-primary" onClick={this.login} disabled={this.state.clickable}>登陆
              <i className={'fa fa-spinner fa-spin loading' + (this.state.clickable ? '' : ' hide')}/>
            </button>
          </form>
        </div>
    );
  }
});

module.exports = LoginForm;