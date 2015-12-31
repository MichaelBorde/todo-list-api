'use strict';

var _ = require('lodash');
var BodyValidator = require('@arpinum/backend').BodyValidator;
var uuid = require('@arpinum/backend').uuid;

function TasksResource(buses) {
  var self = this;
  self.get = get;
  self.post = post;

  function get(request, response) {
    var promise = buses.query.broadcast('tasksQuery');
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
      var taskCommand = _.merge({}, request.body, {id: uuid.create()});
      var promise = buses.command.broadcast('addTaskCommand', taskCommand);
      return promise.then(function () {
        response.send({id: taskCommand.id});
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
