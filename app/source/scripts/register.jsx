'use strict';


require('../less/register.less');
var RegisterApp = require('./component/register-page/register-app.component.jsx');
var RegisterForm = require('./component/register-page/register-form.component.jsx');
var LoginForm = require('./component/register-page/login-form.component.jsx');
var LoginInfo = require('./component/register-page/login-info.component.jsx');
var RegisterAgreement = require('./component/register-page/register-agreement.component.jsx');
var RegisterPassword = require('./component/register-page/register-password.component.jsx');

ReactDom.render(
    <RegisterApp>
      <RegisterForm>
        <RegisterPassword/>
      </RegisterForm>
      <LoginForm/>
      <LoginInfo/>
      <RegisterAgreement/>
    </RegisterApp>,
    document.getElementById('register-container')
);

var SIZE = 0.7;

$(function() {
  $('#agreementModal').on('show.bs.modal', function() {
    $('.modal .modal-body').css('overflow-y', 'auto').css('max-height', $(window).height() * SIZE);
  });
});
