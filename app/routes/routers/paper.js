'use strict';

var express = require('express');
var router = express.Router();

var PaperController = require('../../controllers/paper-controller');
var paperController = new PaperController();

router.get('/:paperId/scoresheet', paperController.exportPaperScoresheetCsv);
router.get('/:paperId/user/:userId/homework-details', paperController.exportUserHomeworkDetailsCsv);
router.get('/:paperId/user/:userId/homeworkquiz/:homeworkquizId', paperController.exportUserHomeworkQuizDetailsCsv);

module.exports = router;