'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userHomeworkAnswerSchema = new Schema({
  homeworkURL: String,
  status: Number,
  version: String,
  branch: String,
  commitTime: Number,
  homeworkDetail: String
});

module.exports = mongoose.model('UserHomeworkAnswer', userHomeworkAnswerSchema);
