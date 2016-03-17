/*eslint no-magic-numbers: 0*/

'use strict';

var Col = require('react-bootstrap/lib/Col');
var Reflux = require('reflux');
var DashboardActions = require('../../actions/dashboard/dashboard-actions');
var DashboardStore = require('../../store/dashboard/dashboard-store');

var DashboardIcon = React.createClass({
  mixins: [Reflux.connect(DashboardStore)],

  getInitialState: function () {
    return {
      puzzleEnabled: true,
      homeworkEnabled: true
    };
  },

  showPrompt: function (puzzleEnabled, homeworkEnabled, event) {
    var iconName = event.target.parentNode.getAttribute('name');
    DashboardActions.showPrompt(puzzleEnabled, homeworkEnabled, iconName);
  },

  hidePrompt: function () {
    DashboardActions.hidePrompt();
  },

  render() {

    var PuzzleHref = (this.state.puzzleEnabled === true ? 'logic-puzzle.html' : '#');
    var homeworkHref = (this.state.homeworkEnabled === true ? 'homework.html' : '#');

    var puzzleDisable = (this.state.puzzleEnabled === true ? 'enable' : 'disable');
    var homeworkDisable = (this.state.homeworkEnabled === true ? 'enable' : 'disable');

    var iconInfos = {
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
        <div className="col-md-4 col-sm-6 col-md-offset-4">
          <a href={iconInfos[this.props.name].href} className="icon-view"
             onMouseOver={this.showPrompt.bind(this, this.state.puzzleEnabled, this.state.homeworkEnabled)}
             onMouseOut={this.hidePrompt}>

            <div className={'icon-wrapper-'+iconInfos[this.props.name].isEnabled}
                 name={iconInfos[this.props.name].name}>
              <div className="icon-img" name={iconInfos[this.props.name].name}>
                <span className={'glyphicon '+iconInfos[this.props.name].glyphicon} aria-hidden="true"/>
              </div>
              <div className="icon-name">
                {iconInfos[this.props.name].title}
              </div>
            </div>
          </a>
        </div>
    );
  }
});

module.exports = DashboardIcon;