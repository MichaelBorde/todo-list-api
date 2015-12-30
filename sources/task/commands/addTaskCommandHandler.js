'use strict';

module.exports = function (repositories) {
  return function (task) {
    return repositories.task.add(task);
  };
};
