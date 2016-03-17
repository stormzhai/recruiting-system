'use strict';

require('../less/start.less');

var StartInfo = require('./component/start-info/start-info.component');
var Navigation = require('./component/navigation/navigation.component');

ReactDom.render(
    <div>
      <header>
        <Navigation />
      </header>
      <StartInfo />
    </div>,
    document.getElementById('start-container')
);
