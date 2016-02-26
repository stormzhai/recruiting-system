'use strict';

var React = require('react');
var validate = require('validate.js');
var constraint = require('../../../../mixin/password-constraint');
var getError = require('../../../../mixin/get-error');
var ChangePasswordActions = require('../../actions/user-center/change-password-actions');
var ChangePasswordStore = require('../../store/user-center/change-password-store');
var UserCenterStore = require('../../store/user-center/user-center-store');
var Reflux = require('reflux');
var _  = require('lodash');

var ChangePassword = React.createClass({
  mixins: [Reflux.connect(ChangePasswordStore),Reflux.connect(UserCenterStore)],

  getInitialState: function () {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      oldPasswordError: '',
      newPasswordError: '',
      confirmPasswordError: '',
      success: false,
      isRespond: false,
      currentState: 'userDetail'
    };
  },

  componentWillReceiveProps: function () {
    this.setState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      oldPasswordError: '',
      newPasswordError: '',
      confirmPasswordError: '',
      success: false
    });
  },

  validate: function (evt) {
    var target = evt.target;
    var name = target.name;
    var value = target.value;
    var valObj = {};

    if (name === 'confirmPassword') {
      valObj = {
        newPassword: this.state.newPassword,
        confirmPassword: this.state.confirmPassword
      };
    } else {
      valObj[name] = value;
    }
    var result = validate(valObj, constraint);
    var error = getError(result, name);
    var stateObj = {};

    stateObj[name + 'Error'] = error;
    this.setState(stateObj);
  },

  handleChange: function (evt) {
    var newState = evt.target.value;
    var stateName = evt.target.name;

    this.setState({[stateName]: newState});
  },

  checkInfo: function () {
    var oldPassword = {oldPassword: this.state.oldPassword};
    var newPassword = {newPassword: this.state.newPassword};
    var confirmPassword = {confirmPassword: this.state.confirmPassword};
    var passwordInfo = [];
    var pass = false;
    var stateObj = {};

    passwordInfo.push(oldPassword, newPassword, confirmPassword);
    passwordInfo.forEach((item) => {
      var confirmItem;
      var result = validate(item, constraint);

      if(Object.keys(item).toString() === 'confirmPassword') {
        confirmItem = _.assign(_.cloneDeep(item), newPassword);
        result = validate(confirmItem, constraint);
      }
      var error = getError(result, Object.keys(item));
      if (error !== '') {
        pass = true;
      }
      stateObj[Object.keys(item) + 'Error'] = error;
      this.setState(stateObj);
    });
    return pass;
  },

  savePassword: function (evt) {
    evt.preventDefault();

    var passwordData = {
      oldPassword: this.state.oldPassword,
      password: this.state.newPassword,
      confirmPassword: this.state.confirmPassword
    };

    if (this.checkInfo()) {
      return;
    }

    ChangePasswordActions.changePassword(passwordData);
  },

  render: function () {
    var classString = (this.state.currentState === 'password' ? '' : ' hide');

    return (
        <div className={'col-md-9 col-sm-9 col-xs-12' + classString}>
          <div className="content">
            <form className="form-horizontal form-top-height">
              <div className={this.state.success ? '' : 'hide'}>
                <div className={"success-prompt alert alert-success"}>
                  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/>
                  修改成功
                </div>
              </div>

              <div id="change-password">
                <label htmlFor="oldPassword" className="col-sm-4 col-md-4 control-label">旧密码</label>
                <div className={'form-group has-' + (this.state.oldPasswordError === '' ? '' : 'error')}>
                  <div className="col-sm-4 col-md-4">
                    <input type="password" className="form-control" aria-describedby="helpBlock2"
                           name="oldPassword" id="oldPassword" onChange={this.handleChange}
                           placeholder="请输入旧密码" onBlur={this.validate} value={this.state.oldPassword}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.oldPasswordError === '' ? ' hide' : '')}
                       role="alert">
                    <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/>
                    {this.state.oldPasswordError}
                  </div>
                </div>

                <label htmlFor="newPassword" className="col-sm-4 col-md-4 control-label">新密码</label>
                <div className={'form-group has-' + (this.state.newPasswordError === '' ? '' : 'error')}>
                  <div className="col-sm-4 col-md-4">
                    <input type="password" className="form-control" aria-describedby="helpBlock2"
                           name="newPassword" id="newPassword"
                           placeholder="请输入新密码" onBlur={this.validate}
                           onChange={this.handleChange} value={this.state.newPassword}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.newPasswordError === '' ? ' hide' : '')}
                       role="alert">
                    <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/>
                    {this.state.newPasswordError}
                  </div>
                </div>

                <label htmlFor="confirmPassword" className="col-sm-4 col-md-4 control-label">确认密码</label>
                <div className={'form-group has-' + (this.state.confirmPasswordError === '' ? '' : 'error')}>
                  <div className="col-sm-4 col-md-4">
                    <input type="password" className="form-control" aria-describedby="helpBlock2"
                           name="confirmPassword" id="confirmPassword"
                           placeholder="请再次确认新密码" onBlur={this.validate}
                           onChange={this.handleChange} value={this.state.confirmPassword}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.confirmPasswordError === '' ? ' hide' : '')}
                       role="alert">
                    <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/>
                    {this.state.confirmPasswordError}
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-sm-offset-4 col-sm-4 col-md-offset-4 col-md-4">
                    <button type="submit" className="btn btn-default" onClick={this.savePassword}
                            disabled={this.state.isRespond}>保存
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
    );
  }
});

module.exports = ChangePassword;
