'use strict';

module.exports = function (repositories, buses) {
  return function (task) {
    return repositories.task.add(task).then(function (addedTask) {
      buses.event.broadcast('taskAddedEvent', addedTask);
      return {id: addedTask.id};
    });
  };
};
