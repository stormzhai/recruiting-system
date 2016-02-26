'use strict';

var React = require('react');
var UserCenterApp = React.createClass({

  render() {
    return (
        <div className="row container-fluid">
          {this.props.children}
        </div>
    );
  }
});

module.exports = UserCenterApp;