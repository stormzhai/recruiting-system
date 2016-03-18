'use strict';

var express = require('express');
var router = express.Router();

var NavigationController = require('../../controllers/navigation-controller');
var navigationController = new NavigationController();

router.get('/', navigationController.loadAccount);

module.exports = router;
