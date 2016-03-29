/*eslint no-magic-numbers: 0*/
'use strict';

var Reflux = require('reflux');
var HomeworkActions = require('../../actions/homework/homework-actions');
var superAgent = require('superagent');
var constant = require('../../../../mixin/constant');
var errorHandler = require('../../../../tools/error-handler.jsx');
var homeworkQuizzesStatus = require('../../../../mixin/constant').homeworkQuizzesStatus;
var request = require('superagent');

var submissionIntroductionStore = Reflux.createStore({
  listenables: [HomeworkActions],

  onChangeOrderId: function (clickNumber) {
    this.onReload(clickNumber);
    this.trigger({
      currentHomeworkNumber: clickNumber,
      githubUrlError: '',
      disableBranches: true,
      branches: [],
      defaultBranch: '',
      githubUrl: '',
      githubBranch: '',
      quizStatus: 0,
      showIcon: false
    });
  },

  onReload: function(orderId) {
    request.get('homework/quiz')
        .set('Content-Type', 'application/json')
        .query({orderId: orderId})
        .use(errorHandler)
        .end((err, res) => {
          if(!res.body.quiz) {
            return;
          }
          if (res.body.quiz.quizStatus === homeworkQuizzesStatus.PROGRESS) {
            this.trigger({
              quizStatus: homeworkQuizzesStatus.PROGRESS,
              githubUrl: res.body.quiz.userAnswerRepo,
              branches: [res.body.quiz.branch]
            });
          } else if (res.body.quiz.quizStatus === homeworkQuizzesStatus.SUCCESS) {
            this.trigger({
              quizStatus: homeworkQuizzesStatus.SUCCESS,
              githubUrl: res.body.quiz.userAnswerRepo,
              branches: [res.body.quiz.branch]
            });
          } else {
            this.trigger({
              quizStatus: res.body.quiz.quizStatus
            });
          }
        });
  },

  onSubmitUrl: function (url, branch, commitSHA, orderId) {
    superAgent.post('homework/save')
        .set('Content-Type', 'application/json')
        .send({orderId: orderId, userAnswerRepo: url, branch: branch, commitSHA: commitSHA})
        .use(errorHandler)
        .end((err, res) => {
          if (res.body.status === constant.httpCode.OK) {
            this.trigger({quizStatus: constant.homeworkQuizzesStatus.PROGRESS});
          }
        });
  },

  onGetBranches: function (url) {
    this.trigger({showIcon:true});
    if(url.indexOf('https://') === -1){
      url = 'https://' + url;
    }
    superAgent.get('/homework/get-branches')
        .set('Content-Type', 'application/json')
        .query({url: url})
        .use(errorHandler)
        .end((err, res)=> {
          if (res.body.message === 'Not Found') {
            this.trigger({githubUrlError: '仓库不存在',branches: [],showIcon:false});
          } else {
            var branches = res.body.data.map((branch)=>{
              return branch.name;
            });
            if(branches.indexOf('master') !== -1){
              var index = branches.indexOf('master');
              branches.splice(index,1);
              branches.unshift('master');
            }
            this.trigger({
              branches: branches,
              defaultBranch: branches[0],
              showIcon:false,
              branchesDetail: res.body.data
            });
          }
        });
  }
});

module.exports = submissionIntroductionStore;
