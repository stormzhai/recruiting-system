'use strict';

var express = require('express');
var router = express.Router();

var UserController = require('../../controllers/user-controller');
var userController = new UserController();

router.get('/:userId/homework-details', userController.exportHomeworkDetails);

module.exports = router;