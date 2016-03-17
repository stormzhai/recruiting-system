'use strict';

var Reflux = require('reflux');
var DashboardStore = require('../../store/dashboard/dashboard-store');


var Alertcontent = React.createClass({
  mixins: [Reflux.connect(DashboardStore)],

  getInitialState: function () {
    return {
      isTip: false,
      tipContent: ''
    };
  },

  render() {
    return (
        <div className="row">
          <div className="col-xs-4 col-xs-offset-4">
            <div style={{visibility:this.state.isTip===true?'':'hidden'}} className="alert alert-success" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/>
              <span className="sr-only">Error:</span>
              {this.state.tipContent}
            </div>
          </div>
        </div>
    );
  }
});

module.exports = Alertcontent;


