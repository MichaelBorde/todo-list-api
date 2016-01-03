'use strict';

var QueriedObjectNotFoundError = require('@arpinum/backend').QueriedObjectNotFoundError;

module.exports = function (projections) {
  return function (query) {
    return projections.task.findFirst(query).then(function (task) {
      if (!task) {
        throw new QueriedObjectNotFoundError(query);
      }
      return task;
    });
  };
};
