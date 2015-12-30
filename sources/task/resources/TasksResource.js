'use strict';

var BodyValidator = require('@arpinum/backend').BodyValidator;

function TasksResource(commandBus) {
  var self = this;
  self.get = get;
  self.post = post;

  function get(request, response) {
    var promise = commandBus.broadcast('findTasksCommand');
    return promise.then(function (tasks) {
      response.send(tasks);
    });
  }

  function post(request, response) {
    return new BodyValidator().promiseIfBodyIsValid({
      schema: taskSchema(),
      request: request,
      response: response,
      errorMessage: 'Invalid task',
      promise: validPost
    });

    function validPost(request, response) {
      var promise = commandBus.broadcast('addTaskCommand', request.body);
      return promise.then(function (data) {
        response.send(data);
      });
    }

    function taskSchema() {
      return {
        type: 'object',
        properties: {
          text: {type: 'string', error: 'the text is mandatory'}
        }
      };
    }
  }
}

module.exports = TasksResource;
