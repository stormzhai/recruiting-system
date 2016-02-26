/*eslint no-magic-numbers: 0*/

'use strict';

var React = global.React = require('react');
var Col = require('react-bootstrap/lib/Col');
var Reflux = require('reflux');
var DashboardActions = require('../../actions/dashboard/dashboard-actions');
var DashboardStore = require('../../store/dashboard/dashboard-store');

var DashboardIcon = React.createClass({
  mixins: [Reflux.connect(DashboardStore)],

  getInitialState: function(){
    return {
      puzzleEnabled: false,
      homeworkEnabled: false
    };
  },

  showPrompt: function (puzzleEnabled, homeworkEnabled, event){
    DashboardActions.showPrompt(puzzleEnabled, homeworkEnabled, event);
  },

  hidePrompt: function (){
    DashboardActions.hidePrompt();
  },

  render() {

    var PuzzleHref = (this.state.puzzleEnabled===true ? 'logic-puzzle.html':'#');
    var homeworkHref = (this.state.homeworkEnabled===true ? 'homework.html':'#');

    var puzzleDisable = (this.state.puzzleEnabled === true ? 'enable' : 'disable');
    var homeworkDisable = (this.state.homeworkEnabled === true ? 'enable' : 'disable');

    var iconInfos = {
      userCenter: {
        title: '个人中心',
        href: 'user-center.html',
        isEnabled: 'enable',
        name: 'userCenter',
        glyphicon: 'glyphicon-user'
      },
      logic: {
        title: '逻辑题',
        href: PuzzleHref,
        isEnabled: puzzleDisable,
        name: 'logic',
        glyphicon: 'glyphicon-education'
      },
      homework: {
        title: '编程题',
        href: homeworkHref,
        isEnabled: homeworkDisable,
        name: 'homework',
        glyphicon: 'glyphicon-road'
      }
    };
    return (
      <Col xs={12} sm={6} md={4} lg={4}>
        <a href={iconInfos[this.props.name].href} className="icon-view"
           onMouseOver={this.showPrompt.bind(this, this.state.puzzleEnabled, this.state.homeworkEnabled)}
           onMouseOut={this.hidePrompt}>

          <div className={'icon-wrapper-'+iconInfos[this.props.name].isEnabled} name={iconInfos[this.props.name].name}>
            <div className="icon-img" name={iconInfos[this.props.name].name}>
              <span className={'glyphicon '+iconInfos[this.props.name].glyphicon} aria-hidden="true"/>
            </div>
            <div className="icon-name">
              {iconInfos[this.props.name].title}
            </div>
          </div>
        </a>
      </Col>
      );
  }
});

module.exports = DashboardIcon;