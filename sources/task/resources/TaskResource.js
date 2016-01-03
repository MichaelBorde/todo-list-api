'use strict';

function TaskResource(buses) {
  var self = this;
  self.get = get;
  self.patch = patch;
  self.delete = doDelete;

  function get(request, response) {
    var command = {id: id(request)};
    var promise = buses.query.broadcast('taskQuery', command);
    return promise.then(function (taskFound) {
      response.send(taskFound);
    });
  }

  function patch(request, response) {
    var command = {criteria: {id: id(request)}, update: request.body};
    var promise = buses.command.broadcast('updateTaskPartiallyCommand', command);
    return promise.then(function () {
      response.end();
    });
  }

  function doDelete(request, response) {
    var promise = buses.command.broadcast('deleteTaskCommand', {id: id(request)});
    return promise.then(function () {
      response.end();
    });
  }

  function id(request) {
    return request.params.id;
  }
}

module.exports = TaskResource;
