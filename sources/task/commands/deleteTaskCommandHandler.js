'use strict';

module.exports = function (repositories, buses) {
  return function (command) {
    var deletion = {id: command.id};
    return repositories.task.deleteFirst(deletion).then(function () {
      buses.event.broadcast('taskDeletedEvent', deletion);
    });
  };
};
