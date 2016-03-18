'use strict';

var Tabs = require('react-bootstrap/lib/Tabs');
var Tab = require('react-bootstrap/lib/Tab');

var HomeworkContent = React.createClass({

  render(){

    return (
    <div className="col-md-9 col-sm-9 col-xs-12">
      <div className="content">
        <Tabs defaultActiveKey={0} animation={false} getShowStatus={true}>
          <Tab eventKey={0} title="题目说明">{this.props.children[0]}</Tab>
          <Tab eventKey={1} title="提交作业">{this.props.children[1]}</Tab>
          <Tab eventKey={2} title="运行结果">{this.props.children[2]}</Tab>
        </Tabs>
      </div>
    </div>
    );
  }

});

module.exports = HomeworkContent;
