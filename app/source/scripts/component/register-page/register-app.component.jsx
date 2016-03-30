'use strict';


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
