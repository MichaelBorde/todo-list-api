'use strict';

var _ = require('lodash');
var bodyValidator = new (require('./../BodyValidator'))();

function AuthenticationValidationsResource(commandBus) {
  var self = this;
  self.post = post;

  function post(request, response) {
    return bodyValidator.promiseIfBodyIsValid({
      schema: authenticationSchema(),
      request: request,
      response: response,
      errorMessage: 'Invalid authentication',
      promise: validPost
    });

    function validPost(request, response) {
      var promise = commandBus.broadcast('ValidateAuthenticationCommand', request.body);
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
