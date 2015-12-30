'use strict';

var _ = require('lodash');

function TaskResource(buses) {
  var self = this;
  self.get = get;
  self.patch = patch;
  self.delete = doDelete;

  function get(request, response) {
    var task = {id: id(request)};
    var promise = buses.query.broadcast('taskQuery', task);
    return promise.then(function (taskFound) {
      response.send(taskFound);
    });
  }

  function patch(request, response) {
    var task = _.merge({id: id(request)}, request.body);
    var promise = buses.command.broadcast('updateTaskPartiallyCommand', task);
    return promise.then(function () {
      response.end();
    });
  }

  function doDelete(request, response) {
    var promise = buses.command.broadcast('deleteTaskCommand', id(request));
    return promise.then(function () {
      response.end();
    });
  }

  function id(request) {
    return request.params.id;
  }
}

module.exports = TaskResource;
