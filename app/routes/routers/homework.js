'use strict';

var express = require('express');
var router = express.Router();

var HomeworkController  = require('../../controllers/homework-controller');
var homeworkController  = new  HomeworkController();
var githubReq = require('../../services/github-req.js');


router.get('/get-list', homeworkController.getList);
router.get('/quiz',homeworkController.getQuiz);
router.get('/get-branches',githubReq.getBranches);
router.post('/save',homeworkController.saveGithubUrl);
router.put('/status/:historyId', homeworkController.updateStatus);

module.exports = router;
