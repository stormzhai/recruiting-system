'use strict';

var express = require('express');
var router = express.Router();
var constant = require('../../mixin/constant');

var logicPuzzle = require('../../models/logic-puzzle');

router.get('/', function (req, res) {
  let userId = req.session.user.id;
  logicPuzzle.isPaperCommited(userId, (err,data) => {
    if(err){
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
    }
    res.send({
      isPaperCommited: data
    });
  });
});

module.exports = router;
