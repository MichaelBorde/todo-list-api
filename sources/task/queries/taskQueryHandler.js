'use strict';

module.exports = function taskQuery(queryProcessor) {
  return function (task) {
    return queryProcessor.findFirst('tasks', task);
  };
};
