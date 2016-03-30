'use strict';

var Navigation = React.createClass({
  render: function () {
    return (
        <nav>
          <div className="brand">
            <a href="/"><strong>思沃特训营</strong></a>
          </div>
          {this.props.children}
        </nav>
    );
  }
});

module.exports = Navigation;
