/*eslint no-magic-numbers: 0*/
'use strict';

var glob = require('glob');

var min = 2001;
var max = 8000;

glob('/Users/wjlin/works/coach/071-logic-exam-generate/workable_exam_after_verify/*.json', function(err, files) {
  var data, values;

  var result = files.filter(function(file) {
    var filename = parseInt(file.split('/')[7].split('.')[0]);
    return filename >= min && filename <= max;
  }).map(function(file) {
    data = require(file);
    values = ['[0,2,7,2,1,5,7,1,4,8]',
      encodeURI(data.steps_string),
      data.count,
      data.question_zh,
      data.steps_length,
      data.max_update_times,
      data.answer,
      JSON.stringify(data.desc_zh),
      'logic-puzzle/' + /(\d+)\.json$/.exec(file)[1] + '.png',
      'logic-puzzle/' + /(\d+)\.json$/.exec(file)[1] + '.json'
    ].join('\', \'');

    return 'INSERT INTO quizItem VALUES(null, \''+values+'\');';
  }).join('\n');

  console.log(result);
});

