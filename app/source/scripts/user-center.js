'use strict';


require('../less/user-center.less');
require('react-input-calendar/styles/input-calendar.css');
var UserCenterApp = require('./component/user-center/user-center-app.component');
var Navigation = require('./component/navigation/navigation.component');
var UserDetail = require('./component/user-center/user-center-detail.component');
var ChangePassword = require('./component/user-center/change-password.component');
var UserCenterSidebar = require('./component/user-center/user-center-sidebar.component');
var UserCenterGender = require('./component/user-center/user-center-gender.component');
var UserCenterBirthday = require('./component/user-center/user-center-birthday.component');
var NewPassword = require('./component/reuse/new-password.component');
var FeedbackResult = require('./component/user-center/feedback-result.component');

ReactDom.render(
    <div>
      <header>
        <Navigation />
      </header>
      <UserCenterApp>
        <UserCenterSidebar/>
        <UserDetail>
          <UserCenterGender/>
          <UserCenterBirthday/>
        </UserDetail>
        <ChangePassword>
          <NewPassword initialStatus="userDetail"/>
        </ChangePassword>
        <FeedbackResult/>
      </UserCenterApp>
    </div>,
    document.getElementById('user-center')
);
