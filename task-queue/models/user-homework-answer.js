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

userHomeworkAnswerSchema.statics.updateStatus = function (uniqId, status, callback) {
  this.findOne({_id: uniqId}, (err, doc) => {
    if (err || !doc) {
      callback(true);
    } else {
      doc.status = status;
      doc.save(callback);
    }
  });
};

userHomeworkAnswerSchema.statics.writeResult = function (uniqId, data, callback) {
  this.findOne({_id: uniqId}, (err, doc) => {
    if (err || !doc) {
      callback(true);
    } else {
      doc.status = data.result;
      doc.homeworkDetail = data.resultDetail;

      doc.save(callback);
    }
  });
};

module.exports = mongoose.model('UserHomeworkAnswer', userHomeworkAnswerSchema);
