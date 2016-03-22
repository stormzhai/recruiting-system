'use strict';

var Reflux = require('reflux');
var RunningResultStore = require('../../store/homework/running-result-store');
var HomeworkActions = require('../../actions/homework/homework-actions');

var RunningResult = React.createClass({
  mixins: [Reflux.connect(RunningResultStore)],
  getInitialState: function () {
    return {
      orderId: this.props.orderId,
      isSubmited: false,
      resultText: ''
    };
  },

  componentDidMount: function () {
    HomeworkActions.getRunningResult(this.props.orderId);
  },

  render() {
    if(this.state.isSubmited){
      if(!this.state.resultText){
        this.state.resultText = '正在进行测试,请稍候 ... ...';
      }
    }
    return (
        <div className="runningResult tab">
          <div className="result">
            <label>运行结果为:</label>
            <div className="content">
              {this.state.resultText}
            </div>
          </div>

        </div>
    );
  }
});

module.exports = RunningResult;