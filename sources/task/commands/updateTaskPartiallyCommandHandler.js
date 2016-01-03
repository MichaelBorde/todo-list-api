'use strict';

module.exports = function (repositories, buses) {
  return function (command) {
    return repositories.task.updateFirst(command.criteria, command.update).then(function () {
      buses.event.broadcast('taskPartiallyUpdatedEvent', command);
    });
  };
};
