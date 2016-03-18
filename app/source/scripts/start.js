'use strict';

require('../less/start.less');

var StartInfo = require('./component/start-info/start-info.component');
var Navigation = require('./component/navigation/navigation.component');
var Account = require('./component/reuse/get-account.component');

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
