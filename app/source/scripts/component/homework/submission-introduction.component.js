'use strict';

var Reflux = require('reflux');
var validate = require('validate.js');
var constraint = require('../../../../mixin/url-constraint');
var homeworkQuizzesStatus = require('../../../../mixin/constant').homeworkQuizzesStatus;
var HomeworkActions = require('../../actions/homework/homework-actions');
var HomeworkIntroductionStore = require('../../store/homework/homework-introduction-store');
var SubmissionIntroductionStore = require('../../store/homework/submission-introduction-store');

function getError(validateInfo, field) {
  if (validateInfo && validateInfo[field] && validateInfo[field].length > 0) {
    return validateInfo[field][0];
  }
  return '';
}

var SubmissionIntroduction = React.createClass({
  mixins: [Reflux.connect(HomeworkIntroductionStore), Reflux.connect(SubmissionIntroductionStore)],
  getInitialState: function () {
    return {
      showRepo: this.props.getShowStatus,
      currentHomeworkNumber: this.props.homeworkNumber,
      githubUrlError: '',
      disableBranches: true,
      branches: [],
      defaultBranch: '',
      githubUrl: '',
      githubBranch: '',
      quizStatus: 0,
      showIcon: false,
      branchesDetail: []
    };
  },
  componentDidUpdate: function (prevProps, prevState) {
    this.refs.githubUrl.value = this.state.githubUrl;
  },

  clickBranch: function () {
    HomeworkActions.getBranches(this.state.githubUrl);
  },
  clickSubmit: function () {
    if (!this.state.githubBranch) {
      this.state.githubBranch = this.state.defaultBranch;
    }

    var commitSHA;

    this.state.branchesDetail.forEach((item) => {
      if(item.name === this.state.githubBranch) {
        commitSHA = item.commit.sha;
      }
    });
    this.props.startProgress();
    HomeworkActions.submitUrl(this.state.githubUrl, this.state.githubBranch, commitSHA, this.state.currentHomeworkNumber);
  },
  onUrlChange: function (event) {
    var target = event.target;
    var value = target.value;

    this.state.githubUrl = value;

    var name = target.name;
    var valObj = {};
    valObj[name] = value;

    var result = validate(valObj, constraint);
    var error = getError(result, name);
    var stateObj = {};
    stateObj[name + 'Error'] = error;

    this.setState(stateObj);

    this.state.disableBranches = !!error;
    if (error) {
      this.state.branches = [];
    }
  },
  onBranchChange: function (event) {
    this.state.githubBranch = event.target.value;
  },

  render() {
    if (this.state.quizStatus === homeworkQuizzesStatus.PROGRESS) {
      HomeworkActions.submited(this.state.currentHomeworkNumber);
    }
    var isSubmitted = this.state.quizStatus === homeworkQuizzesStatus.PROGRESS || this.state.quizStatus === homeworkQuizzesStatus.SUCCESS;

    var branches = this.state.branches.map((branch, index)=> {
      return (<option key={index}>{branch}</option>);
    });
    return (
        <div className="tab">
          <div className={(this.state.showRepo ? '' : ' hide')}>
            <div className="row last-time">
            </div>
            <div className="form-horizontal">
              <div className="form-group">
                <label className="col-xs-2 control-label">编程题模板库地址</label>
                <div className="col-xs-9">
                  <label className="form-control">{this.state.templateRepo}</label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="githubUrl" className="col-sm-2 control-label">github仓库地址</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="githubUrl" name="githubUrl" ref="githubUrl"

                         onChange={this.onUrlChange} placeholder="https://github.com/用户名/仓库名" disabled={isSubmitted ? 'disabled':''}/>
                  <div
                      className={'lose' + (this.state.githubUrlError === '' ? ' hide' : '')}>{this.state.githubUrlError}</div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">github仓库分支</label>
                <div className="col-sm-7">
                  <select className="form-control" disabled={isSubmitted ? 'disabled':''} onChange={this.onBranchChange}>
                    {branches}
                  </select>
                </div>
                <div className="col-sm-2">
                  <button className="btn btn-default btn-block"
                          disabled={(this.state.disableBranches || isSubmitted) === true ? 'disabled':''}
                          onClick={this.clickBranch}>获取分支
                    <i className={'fa fa-spinner fa-spin loading' + (this.state.showIcon ? '' : ' hide')}/>
                  </button>
                </div>
              </div>
              <div className="col-sm-2 col-sm-offset-2">
                <button className="btn btn-default btn-block"
                        disabled={(this.state.branches.length === 0) || isSubmitted ? 'disabled':''}
                        onClick={this.clickSubmit}>提交地址
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  }
});

module.exports = SubmissionIntroduction;