'use strict';

require('../less/homework.less');

var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');
var HomeworkSidebar = require('./component/homework/homework-sidebar.component.jsx');
var HomeworkContent = require('./component/homework/homework-content.component.jsx');
var HomeworkIntroduction = require('./component/homework/homework-introduction.component.jsx');
var SubmissionIntroduction = require('./component/homework/submission-introduction.component.jsx');
var RunningResult = require('./component/homework/running-result.component.jsx');

var constant = require('../../mixin/constant');
var request = require('superagent');
var errorHandler = require('../../tools/error-handler.jsx');
var homeworkQuizzesStatus = require('../../mixin/constant').homeworkQuizzesStatus;

var Reflux = require('reflux');
var HomeworkAction = require('./actions/homework/homework-actions');
var HomeworkStore = require('./store/homework/homework-store.js');

var Homework = React.createClass({
  mixins: [Reflux.connect(HomeworkStore)],

  getInitialState: function (){
    return {
      homeworkQuizzes: [],
      orderId: 1,
      currentQuiz: {}
    };
  },

  handleOrderIdChange: function(_orderId) {
    this.setState({
      orderId: _orderId
    });
    history.pushState(null, '', '#' + _orderId);
    HomeworkAction.changeOrderId(_orderId);
  },

  componentDidUpdate: function() {
    var _orderId = parseInt(location.hash.substr(1));
    if(this.state.orderId !== _orderId) {
      history.pushState(null, '', '#' + this.state.orderId);
    }
  },

  pollData: function() {

  },

  componentDidMount: function (){
    HomeworkAction.init();
    window.onpopstate = HomeworkAction.init;
  },

  render: function(){
    return (
      <div>
        <header>
          <Navigation>
            <Account />
          </Navigation>
        </header>
          <div>
            <HomeworkSidebar
                homeworkQuizzes={this.state.homeworkQuizzes}
                onOrderIdChange={this.handleOrderIdChange}
                orderId={this.state.orderId}/>

            <HomeworkContent quiz={this.state.currentQuiz}>
                <HomeworkIntroduction
                    quiz={this.state.currentQuiz}/>

                <SubmissionIntroduction
                    quiz={this.state.currentQuiz}
                    startProgress={this.pollData}/>

                <RunningResult
                    quiz={this.state.currentQuiz}/>
            </HomeworkContent>
          </div>
      </div>
    );
  }
});

ReactDom.render(<Homework />, document.getElementById('homework'));
