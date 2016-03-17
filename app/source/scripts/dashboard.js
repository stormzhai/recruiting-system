'use strict';


var Dashboard = require('./component/dashboard/dashboard.component');
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
      <Dashboard>
        <Alertcontent />
        <Row>
          <DashboardIcon name="userCenter"/>
          <DashboardIcon name="logic"/>
          <DashboardIcon name="homework"/>
        </Row>
      </Dashboard>
    </div>,
    document.getElementById('dashboard-container')
);
