'use strict';

module.exports = function (repositories, buses) {
  return function (command) {
    var deletion = {id: command.id};
    return repositories.task.delete(deletion).then(function () {
      buses.event.broadcast('taskDeletedEvent', deletion);
    });
  };
};
