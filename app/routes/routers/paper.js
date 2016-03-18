'use strict';

var express = require('express');
var router = express.Router();

var PaperController = require('../../controllers/paper-controller');
var paperController = new PaperController();

router.get('/:paperId/scoresheet', paperController.exportCsv);

module.exports = router;