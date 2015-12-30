'use strict';

var _ = require('lodash');
var BodyValidator = require('@arpinum/backend').BodyValidator;

function AuthenticationValidationsResource(commandBus) {
  var self = this;
  self.post = post;

  function post(request, response) {
    return new BodyValidator().promiseIfBodyIsValid({
      schema: authenticationSchema(),
      request: request,
      response: response,
      errorMessage: 'Invalid authentication',
      promise: validPost
    });

    function validPost(request, response) {
      var promise = commandBus.broadcast('validateauthenticationCommand', request.body);
      return promise.then(function (data) {
        var resultWithoutErrors = _.omit(data, 'errors');
        response.send(resultWithoutErrors);
      });
    }

    function authenticationSchema() {
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

module.exports = AuthenticationValidationsResource;
