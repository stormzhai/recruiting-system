'use strict';


require('../less/register.less');
var RegisterApp = require('./component/register-page/register-app.component');
var RegisterForm = require('./component/register-page/register-form.component');
var LoginForm = require('./component/register-page/login-form.component');
var LoginInfo = require('./component/register-page/login-info.component');
var RegisterAgreement = require('./component/register-page/register-agreement.component');
var RegisterPassword = require('./component/register-page/register-password.component');

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
