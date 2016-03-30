'use strict';

var express = require('express');
var router = express.Router();

var TaskController = require('../../controllers/task-controller');

var taskController = new TaskController();

router.post('/', taskController.createTask);

router.post('/:uniqId/completion', taskController.result);

router.get('/status', taskController.status);

module.exports = router;
