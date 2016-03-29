'use strict';

var Tabs = require('react-bootstrap/lib/Tabs');
var Tab = require('react-bootstrap/lib/Tab');
var Reflux = require('reflux');
var HomeworkSidebarStore = require('../../store/homework/homework-sidebar-store');


var HomeworkContent = React.createClass({
  mixins: [Reflux.connect(HomeworkSidebarStore)],

  getInitialState: function (){
    return {
      clickNumber: ''
    };
  },

  componentDidUpdate: function (prevProps, prevState){
    if(prevState.clickNumber !== this.state.clickNumber){
      this.refs.tabs.state.activeKey = 0;
      this.setState({
        clickNumber: this.state.clickNumber
      });
    }
  },

  render(){
    return (
    <div className="col-md-9 col-sm-9 col-xs-12">
      <div className="content">
        <Tabs defaultActiveKey={0} animation={false} getShowStatus={true} ref="tabs">
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
