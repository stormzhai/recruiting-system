'use strict';

var Reflux = require('reflux');
var markdown = require('markdown').markdown;
var HomeworkIntroductionStore = require('../../store/homework/homework-introduction-store');


var HomeworkIntroduction = React.createClass({
  mixins: [Reflux.connect(HomeworkIntroductionStore)],

  getInitialState: function () {
    return {
      desc: '',
      showRepo: this.props.getShowStatus
    };
  },

  render() {
    var desc = this.state.desc;

    function content() {
      return {__html: markdown.toHTML(desc)};
    }

    return (
        <div>
          <div id="introduction" dangerouslySetInnerHTML={content()}></div>
          <div className={'templateRepo ' + (this.state.showRepo ? '' : ' hide')}>
            <span>编程题模板库地址:</span><em>{this.state.templateRepo}</em></div>
        </div>
    );
  }
});

module.exports = HomeworkIntroduction;