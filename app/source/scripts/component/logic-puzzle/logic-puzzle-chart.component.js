'use strict';

var Reflux = require('reflux');
var LogicPuzzleStore = require('../../store/logic-puzzle/logic-puzzle-store');

var LogicPuzzleChart = React.createClass({
  mixins: [Reflux.connect(LogicPuzzleStore)],

  getInitialState: function () {
    return {
      item: {
        chartPath: ''
      }
    };
  },

  render: function () {
    return (
        <div className="left-chart">
          <a href={this.state.item.chartPath} data-lightbox="image">
            <img src={this.state.item.chartPath} alt="逻辑题图片"/>
          </a>
        </div>
    );
  }
});

module.exports = LogicPuzzleChart;
