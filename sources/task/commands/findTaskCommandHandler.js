'use strict';

module.exports = function findTaskCommand(repositories) {
  return function run(task) {
    return repositories.task.findFirst(task);
  };
};
