'use strict';

var React = require('react');

var RegisterApp = React.createClass({

  render() {
    return (
        <div className="row">
          {this.props.children}
        </div>
    );
  }
});

module.exports = RegisterApp;
