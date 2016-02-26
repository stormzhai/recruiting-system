'use strict';

require('../less/homework.less');
var ReactDom = require('react-dom');
var Navigation = require('./component/navigation/navigation.component');
var HomeworkSidebar = require('./component/homework/homework-sidebar.component');
var HomeworkContent = require('./component/homework/homework-content.component');
var HomeworkIntroduction = require('./component/homework/homework-introduction.component');
var SubmissionIntroduction = require('./component/homework/submission-introduction.component');
var RunningResult = require('./component/homework/running-result.component');
var HomeworkAction = require('./actions/homework/homework-actions');

function changeId() {
  var orderId;
  var getId = location.hash.substr(1);
  if (getId === '') {
    orderId = 1;
  } else {
    orderId = parseInt(getId);
  }
  return  orderId;
}

window.onpopstate = function () {
  var number = parseInt(location.hash.substr(1));
  HomeworkAction.changeOrderId(number);
};

function onAction(number) {
  HomeworkAction.changeOrderId(number);
  history.pushState(null, '', '#' + number);
}

HomeworkAction.changeOrderId(changeId());

ReactDom.render(
    <div>
      <header>
        <Navigation />
      </header>
        <div className="row">
          <HomeworkSidebar onAction={onAction} orderId={changeId()}/>
          <HomeworkContent>
            <HomeworkIntroduction />
            <SubmissionIntroduction orderId={changeId()}/>
            <RunningResult />
          </HomeworkContent>
        </div>
    </div>,
    document.getElementById('homework')
);