'use strict';

var ReactDom = require('react-dom');
var DashBoard = require('./component/dashboard/dashBoard.component');
var Navigation = require('./component/navigation/navigation.component');
require('../less/dashboard.less');
var Row = require('react-bootstrap/lib/Row');
var Alertcontent = require('./component/dashboard/alert-content.component');
var DashboardIcon = require('./component/dashboard/dashboard-icon.component');

ReactDom.render(
    <div>
      <header>
        <Navigation/>
      </header>
      <DashBoard>
        <Alertcontent />
        <Row>
          <DashboardIcon name="userCenter"/>
          <DashboardIcon name="logic"/>
          <DashboardIcon name="homework"/>
        </Row>
      </DashBoard>
    </div>,
    document.getElementById('dashboard-container')
);
