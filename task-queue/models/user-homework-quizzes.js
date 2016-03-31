'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constant = require('../mixin/constant');

var userHomeworkQuizzesSchema = new Schema({
  userId: Number,
  paperId: Number,
  quizzes: [{
    id: Number,
    startTime: Number,
    userAnswerRepo: String,
    uri: String,
    branch: String,
    homeworkSubmitPostHistory: [{type: Schema.Types.ObjectId, ref: 'UserHomeworkAnswer'}]
  }]
});

userHomeworkQuizzesSchema.statics.findQuizInfo = function (uniqId, callback) {
  var result = {};
  this.findOne({
    quizzes: {$elemMatch: {homeworkSubmitPostHistory: {$in: [uniqId]}}}
  }).populate('quizzes.homeworkSubmitPostHistory')
    .select({
      userId: 1,
      paperId: 1,
      quizzes: {$elemMatch: {homeworkSubmitPostHistory: {$in: [uniqId]}}}
    })
    .exec((err, doc) => {
      if (err || !doc) {
        callback(err);
      } else {
        callback(null, doc);
      }
    });
};

module.exports = mongoose.model('UserHomeworkQuizzes', userHomeworkQuizzesSchema);
