'use strict';

module.exports = function (queryProcessor) {
  return function (criteria) {
    return queryProcessor.findAll('tasks', criteria);
  };
};
