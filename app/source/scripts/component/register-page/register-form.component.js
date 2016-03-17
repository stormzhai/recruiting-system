'use strict';

var Reflux = require('reflux');
var validate = require('validate.js');
var constraint = require('../../../../mixin/register-constraint');
var page = require('page');
var constant = require('../../../../mixin/constant');
var async = require('async');
var RegisterActions = require('../../actions/register-page/register-actions');
var RegisterStore = require('../../store/register-page/register-store');
var LoginStore = require('../../store/register-page/login-store');

var asyncContainersFunc = {
  email: function (value, done){
    RegisterActions.checkEmail(value, done);
  },
  mobilePhone: function (value, done){
    RegisterActions.checkMobilePhone(value,done);
  }
};

function getError(validateInfo, field) {
  if (validateInfo && validateInfo[field] && validateInfo[field].length > 0) {
    return validateInfo[field][0];
  }
  return '';
}


var RegisterForm = React.createClass({
  mixins: [Reflux.connect(RegisterStore),Reflux.connect(LoginStore)],

  getInitialState: function () {
    return {
      isLoginState: false,
      mobilePhoneError: '',
      emailError: '',
      agree: false,
      clickable: false,
      password: ''
    };
  },

  componentDidUpdate:function(prevProps, prevState){
    if(!this.state.isLoginState && prevState.isLoginState) {
      this.setState({
        mobilePhoneError: '',
        emailError: ''
      });
      this.refs.mobilePhone.value = '';
      this.refs.email.value = '';

    };
  },

  handleChange: function (event) {
    var value = event.target.value;
    var name = event.target.name;
    RegisterActions.changeValue(name, value);
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

    if ('' === error && name !== 'password') {
      asyncContainersFunc[name](value, (stateObj) => {
        this.setState(stateObj);
      });
    }
  },

  changeAgreeState: function () {
    var newState = !this.state.agree;
    this.setState({agree: newState});
  },

  checkRegisterData: function (registerInfo) {
    var passCheck = true;

    if (this.state.agree === false) {
      $('#agree-check').modal('show');
      passCheck = false;
    }

    var stateObj = {};
    registerInfo.forEach((item, i) => {
      var valObj = {};

      var value = item.value;
      var name = item.name;

      valObj[name] = value;
      var result = validate(valObj, constraint);

      var error = getError(result, name);
      if (error !== '') {
        passCheck = false;
      }

      stateObj[name + 'Error'] = error;

    });
    RegisterActions.checkData(stateObj);
    return passCheck;
  },

  register: function () {
    if (this.state.mobilePhoneError !== '' || this.state.emailError !== '') {
      return false;
    }
    var registerData = [];
    var mobilePhone = ReactDOM.findDOMNode(this.refs.mobilePhone);
    var email = ReactDOM.findDOMNode(this.refs.email);
    var password = {
      name: 'password',
      value: this.state.password
    };

    registerData.push(mobilePhone, email, password);

    if (!this.checkRegisterData(registerData)) {
      return false;
    } else {
      this.setState({
        clickable: true
      });
      RegisterActions.register(mobilePhone.value, email.value, password.value);
    }
  },

  render: function () {
    var classString = 'col-md-7 logon-form-container' + (this.state.isLoginState ? ' hide' : '');

    return (
        <div id="register" className={classString}>
          <h4 className="welcome">欢迎注册思沃学院</h4>

          <form action="">
            <div className="form-group">
              <input className="form-control" type="text" placeholder="请输入手机号" name="mobilePhone" ref="mobilePhone"
                     onBlur={this.validate} />

              <div
                  className={'lose' + (this.state.mobilePhoneError === '' ? ' hide' : '')}>{this.state.mobilePhoneError}</div>
            </div>

            <div className="form-group">
              <input className="form-control" type="text" placeholder="请输入邮箱" name="email" ref="email"
                     onBlur={this.validate} />

              <div
                  className={'lose' + (this.state.emailError === '' ? ' hide' : '')}>{this.state.emailError}</div>
            </div>

            <div className="form-group">
              {this.props.children}
            </div>

            <div className="checkbox">
              <label>
                <input type="checkbox" className="agree-check" onClick={this.changeAgreeState}/> 同意
              </label>
              <a id="agreement" data-toggle="modal" data-target="#agreementModal">协议</a>
            </div>

            <button type="button" id="register-btn" disabled={this.state.clickable}
                    className="btn btn-lg btn-block btn-primary" ref="register" onClick={this.register}>注册
              <i className={'fa fa-spinner fa-spin' + (this.state.clickable ? '' : ' hide')}/>
            </button>
          </form>
        </div>
    );
  }
});

module.exports = RegisterForm;