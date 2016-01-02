'use strict';

module.exports = function (queryProcessor) {
  return function (query) {
    return queryProcessor.findAll('tasks', query);
  };
};
