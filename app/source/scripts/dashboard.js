'use strict';


var Dashboard = require('./component/dashboard/dashboard.component');
var Navigation = require('./component/navigation/navigation.component');
require('../less/dashboard.less');
var Row = require('react-bootstrap/lib/Row');
var DashboardIcon = require('./component/dashboard/dashboard-icon.component');
var Arrow = require('./component/dashboard/arrow.component');

ReactDom.render(
    <div>
      <header>
        <Navigation/>
      </header>
      <Dashboard>
        <Row>
          <DashboardIcon name="logic"/>
          <Arrow/>
          <DashboardIcon name="homework"/>
        </Row>
      </Dashboard>
    </div>,
    document.getElementById('dashboard-container')
);
