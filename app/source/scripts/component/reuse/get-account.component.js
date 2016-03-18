'use strict';
var GetAccountActions = require('../../actions/reuse/get-account-actions');
var GetAccountStore = require('../../store/reuse/get-account-store');
var Reflux = require('reflux');

var GetAccount = React.createClass({
  mixins: [Reflux.connect(GetAccountStore)],

  getInitialState: function () {
    return {
      isLoged: false,
      account: ''
    };
  },

  componentDidMount: function () {
    GetAccountActions.loadAccount();
  },

  render: function () {
    return (
        <div className="header-right">
          <div className={this.state.isLoged ? 'hide':''}>
            <a href='register.html'>登录/注册</a>
          </div>
          <div className={this.state.isLoged ? 'dropdown' : 'hide'}>
            <a className="dropdown-style" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true"
               aria-expanded="true">
              {this.state.account}
              <span className="caret"></span>
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><a href="user-center.html">个人中心</a></li>
              <li><a href="dashboard.html">控制台</a></li>
              <li role="separator" className="divider"></li>
              <li><a href="/logout">退出</a></li>
            </ul>
          </div>
        </div>
    );
  }
});

module.exports = GetAccount;
