/*eslint no-magic-numbers: 0*/

'use strict';

var React = require('react');
var Reflux = require('reflux');
var HomeworkActions = require('../../actions/homework/homework-actions');
var HomeworkSidebarStore = require('../../store/homework/homework-sidebar-store');
var homeworkQuizzesStatus = require('../../../../mixin/constant').homeworkQuizzesStatus;

var HomeworkSidebar = React.createClass({
  mixins: [Reflux.connect(HomeworkSidebarStore)],

  getInitialState: function () {
    var list = [];
    return {
      homeworkStatusList: list,
      currentHomeworkNumber: this.props.orderId,
      clickNumber: this.props.orderId,
      waitingNumber: null
    };
  },

  componentDidMount: function () {
    HomeworkActions.loadHomeworkList();
  },

  changeIcon: function (state) {
    var icon = 'home-icon h4 fa fa-lg fa-';
    var iconList = ['lock', '', 'clock-o', 'check-circle', 'times-circle'];
    var statusCode = [
      homeworkQuizzesStatus.LOCKED,
      homeworkQuizzesStatus.ACTIVE,
      homeworkQuizzesStatus.PROGRESS,
      homeworkQuizzesStatus.SUCCESS,
      homeworkQuizzesStatus.ERROR
    ];

    statusCode.forEach((item, index) => {
      if (state === item) {
        icon = icon + iconList[index];
      }
    });
    return icon;
  },
  handleClick: function (mark) {
    this.props.onAction(mark);
  },

  render() {
    var list = this.state.homeworkStatusList;
    var itemHtml = list.map((item, index) => {
      var classStr = 'list-group-item ' + (this.state.clickNumber === index + 1 ? ' selected' : '');

      return (
          <button className={classStr} key={index}
                  onClick={this.handleClick.bind(null, index + 1)}>
            <div className="row">
              <div className="col-xs-9 h4 text-center ">{'第' + (index + 1) + '题'}</div>
              <div className='col-xs-3'>
                <i className={index + 1 === this.state.waitingNumber ? this.changeIcon(homeworkQuizzesStatus.PROGRESS):this.changeIcon(item.status)}/></div>
            </div>
          </button>
      );
    });

    return (
        <div className="col-md-3 col-sm-3 col-xs-12">
          <div className="list-group">
            <div className="list-group-item active">
              <div className="row">
                <div className="col-xs-9 h3 text-center">编程题</div>
                <div className="col-xs-3"><i className='homework-nav-icon h3 fa fa-pencil-square-o'/></div>
              </div>
            </div>
            {itemHtml}
          </div>
        </div>
    );
  }
});

module.exports = HomeworkSidebar;