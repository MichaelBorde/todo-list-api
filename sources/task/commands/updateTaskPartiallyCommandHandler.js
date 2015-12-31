'use strict';

module.exports = function (repositories, buses) {
  return function (command) {
    return repositories.task.update(command).then(function () {
      buses.event.broadcast('taskPartiallyUpdatedEvent', command);
    });
  };
};
