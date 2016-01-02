'use strict';

module.exports = function taskQuery(queryProcessor) {
  return function (query) {
    return queryProcessor.findFirst('tasks', query);
  };
};
