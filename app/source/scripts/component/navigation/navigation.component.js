'use strict';

var Navigation = React.createClass({
  render: function () {
    return (
        <nav>
          <div className="brand">
            <a href="/"><strong>思沃特训营</strong></a>
          </div>
          <div className="dropdown header-right">
            <a className="dropdown-style" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              我的账户
              <span className="caret"></span>
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><a href="user-center.html">个人中心</a></li>
              <li><a href="dashboard.html">控制台</a></li>
              <li role="separator" className="divider"></li>
              <li><a href="/logout">退出</a></li>
            </ul>
          </div>
        </nav>
    );
  }
});

module.exports = Navigation;