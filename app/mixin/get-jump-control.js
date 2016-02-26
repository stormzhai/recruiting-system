'use strict';

function jumpControl(data) {
  var isLoged = data.isLoged;
  var isPaperCommited = data.isPaperCommited;
  var isDetailed = data.isDetailed;
  var isAgreed = data.isAgreed;

  return [{
    originPath: [
      'user-center.html',
      'homework.html',
      'logic-puzzle.html',
      'progress.html',
      'start.html',
      'dashboard.html'
    ],
    targetPath: '/register.html',
    condition: !isLoged
  }, {
    originPath: [
      'logic-puzzle.html',
      'start.html'
    ],
    targetPath: '/dashboard.html',
    condition: isLoged && isPaperCommited && isDetailed
  }, {
    originPath: [
      'homework.html',
      'logic-puzzle.html',
      'progress.html',
      'start.html',
      'dashboard.html'
    ],
    targetPath: '/user-center.html',
    condition: isLoged && !isDetailed
  }, {
    originPath: [
      'homework.html'
    ],
    targetPath: 'dashboard.html',
    condition: !isPaperCommited
  }, {
    originPath: [
      'logic-puzzle.html'
    ],
    targetPath: 'start.html',
    condition: !isAgreed
  }, {
    originPath: [
      'start.html'
    ],
    targetPath: 'dashboard.html',
    condition: isAgreed
  }
  ];
}
module.exports = jumpControl;