'use strict';

module.exports = function (repositories, buses) {
  return function (task) {
    return repositories.task.add(task).then(function () {
      buses.event.broadcast('taskAddedEvent', task);
    });
  };
};
