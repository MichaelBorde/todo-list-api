'use strict';

var BodyValidator = require('@arpinum/backend').BodyValidator;

function UserValidationsResource(buses) {
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
      var promise = buses.command.broadcast('validateUserCommand', request.body);
      return promise.then(function (data) {
        response.send(data);
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

module.exports = UserValidationsResource;
