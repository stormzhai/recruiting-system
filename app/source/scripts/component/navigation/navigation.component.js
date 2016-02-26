'use strict';

var React = global.React = require('react');

var Navigation = React.createClass({
  render: function () {
    return (
        <nav>
          <div className="brand">
            <strong>思沃特训营</strong>
          </div>
          <div className="header-right">
            <a href="dashboard.html">控制台</a>
            <a href="/logout">退出</a>
          </div>
        </nav>
    );
  }
});

module.exports = Navigation;