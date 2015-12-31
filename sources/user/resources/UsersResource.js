'use strict';

var _ = require('lodash');
var BodyValidator = require('@arpinum/backend').BodyValidator;
var uuid = require('@arpinum/backend').uuid;

function UsersResource(buses) {
  var self = this;
  self.post = post;

  function post(request, response) {
    return new BodyValidator().promiseIfBodyIsValid({
      schema: userSchema(),
      request: request,
      response: response,
      errorMessage: 'Invalid user',
      promise: validPost
    });

    function validPost(request, response) {
      var userCommand = _.merge({}, request.body, {id: uuid.create()});
      var promise = buses.command.broadcast('addUserCommand', userCommand);
      return promise.then(function () {
        response.send({id: userCommand.id});
      });
    }

    function userSchema() {
      return {
        type: 'object',
        properties: {
          email: {type: 'string', error: 'email is mandatory'},
          password: {type: 'string', error: 'password is mandatory'}
        }
      };
    }
  }
}

module.exports = UsersResource;
