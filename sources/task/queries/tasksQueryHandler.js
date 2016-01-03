'use strict';

module.exports = function (projections) {
  return function (query) {
    return projections.task.findAll(query);
  };
};
