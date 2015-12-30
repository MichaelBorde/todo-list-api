'use strict';

module.exports = function (repositories) {
  return function run(criteria) {
    return repositories.task.findAll(criteria);
  };
};
