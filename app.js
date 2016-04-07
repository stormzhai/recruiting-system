
'use strict';

var express = require('express');
var app = express();
var proxy = require('express-http-proxy');
var path = require('path');
var url = require('url');

app.use(express.static('web/public/assets'));

app.use('/api', proxy('192.168.99.100:3000/',{
  forwardPath: function(req, res) {
    return url.parse(req.url).path;
  }
}));

app.get('*', function (req, res){
  res.sendFile(path.join(__dirname, 'web/public/assets/', '404.html'));
});

app.listen(3333, function () {
  console.log('App listening at http://localhost:' + 3333);
});

module.exports = app;
