'use strict';

var constant = require('../mixin/constant');
var ReactDom = require('react-dom');

var errorHandler = function(req) {
  req.on('response', function (res) {
    if(res.statusCode === constant.httpCode.INTERNAL_SERVER_ERROR || res.status === constant.httpCode.INTERNAL_SERVER_ERROR){
      addErrorMessage();
    }
  });
};

function addErrorMessage() {
  var errorMessageBlock = document.createElement('DIV');
  errorMessageBlock.setAttribute('id','alert');
  document.body.appendChild(errorMessageBlock);

  ReactDom.render(
      <div className="alert alert-danger alert-dismissible text-center fade in" id="alert" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span>哦!糟了!</span>
        <span>看起来我们的服务器出了一些问题!</span>
      </div>,
      document.getElementById('alert')
  );
}

module.exports = errorHandler;