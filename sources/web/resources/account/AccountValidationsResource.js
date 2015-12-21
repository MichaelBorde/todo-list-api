'use strict';

var bodyValidator = new (require('./../BodyValidator'))();

function AccountValidationsResource(commandBus) {
  var self = this;
  self.post = post;

  function post(request, response) {
    return bodyValidator.promiseIfBodyIsValid({
      schema: accountSchema(),
      request: request,
      response: response,
      errorMessage: 'Invalid account',
      promise: validPost
    });

    function validPost(request, response) {
      var promise = commandBus.broadcast('ValidateAccountCommand', request.body);
      return promise.then(function (data) {
        response.send(data);
      });
    }

    function accountSchema() {
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

module.exports = AccountValidationsResource;
