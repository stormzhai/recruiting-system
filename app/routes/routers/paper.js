'use strict';

var express = require('express');
var router = express.Router();

var PaperController = require('../../controllers/paper-controller');
var paperController = new PaperController();

router.get('/:paperId/scoresheet', paperController.exportScoresheetCsvForPaper);
router.get('/:paperId/user/:userId/homework-details', paperController.exportHomeworkDetailsCsvForUser);
router.get('/:paperId/user/:userId/homeworkquiz/:homeworkquiz', paperController.exportScoresheetCsvForPaper);

module.exports = router;