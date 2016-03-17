'use strict';

var express = require('express');
var router = express.Router();

var TaskController = require('../../controllers/task-controller');

var taskController = new TaskController();

router.post('/', taskController.createTask);

router.post('/:homeworkName/completion', taskController.result);

router.post('/status', taskController.status);

module.exports = router;
