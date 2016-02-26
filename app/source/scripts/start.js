'use strict';

var ReactDom = require('react-dom');
var StartInfo = require('./component/start-info/start-info.component');
var Navigation = require('./component/navigation/navigation.component');
var $ = global.jQuery = require('jquery');
require('bootstrap');
require('../less/start.less');

ReactDom.render(
    <div>
      <header>
        <Navigation />
      </header>
      <StartInfo />
    </div>,
    document.getElementById('start-container')
);
