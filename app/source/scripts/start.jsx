'use strict';

require('../less/start.less');

var StartInfo = require('./component/start-info/start-info.component.jsx');
var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');

ReactDom.render(
    <div>
      <header>
        <Navigation>
          <Account />
        </Navigation>
      </header>
      <StartInfo />
    </div>,
    document.getElementById('start-container')
);
