'use strict';

var _ = require('lodash');

function TaskResource(commandBus) {
  var self = this;
  self.get = get;
  self.patch = patch;
  self.delete = doDelete;

  function get(request, response) {
    var task = {id: id(request)};
    var promise = commandBus.broadcast('FindTaskCommand', task);
    return promise.then(function (taskFound) {
      response.send(taskFound);
    });
  }

  function patch(request, response) {
    var task = _.merge({id: id(request)}, request.body);
    var promise = commandBus.broadcast('UpdateTaskPartiallyCommand', task);
    return promise.then(function () {
      response.end();
    });
  }

  function doDelete(request, response) {
    var promise = commandBus.broadcast('DeleteTaskCommand', id(request));
    return promise.then(function () {
      response.end();
    });
  }

  function id(request) {
    return request.params.id;
  }
}

module.exports = TaskResource;
