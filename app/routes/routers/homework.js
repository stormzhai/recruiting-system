'use strict';

var express = require('express');
var router = express.Router();

var HomeworkController  = require('../../controllers/homework-controller');
var homeworkController  = new  HomeworkController();
var Vendor = require('../../vendor/vendor');
var vendor = new Vendor();

router.get('/get-list', homeworkController.getList);
router.get('/quiz',homeworkController.getQuiz);
router.post('/save',homeworkController.saveGithubUrl);
router.post('/result',homeworkController.updateResult);
router.get('/get-branches',vendor.getBranches);
router.get('/getResult',homeworkController.getResult);

module.exports = router;