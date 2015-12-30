'use strict';

module.exports = function (repositories) {
  return function run(task) {
    return repositories.task.update(task).return();
  };
};
