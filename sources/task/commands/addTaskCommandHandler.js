'use strict';

module.exports = function (repositories, buses) {
  return function (command) {
    return repositories.task.add(command).then(function () {
      buses.event.broadcast('taskAddedEvent', command);
    });
  };
};
