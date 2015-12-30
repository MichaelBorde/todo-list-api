'use strict';

var BodyValidator = require('@arpinum/backend').BodyValidator;

function AccountsResource(buses) {
  var self = this;
  self.post = post;

  function post(request, response) {
    return new BodyValidator().promiseIfBodyIsValid({
      schema: accountSchema(),
      request: request,
      response: response,
      errorMessage: 'Invalid account',
      promise: validPost
    });

    function validPost(request, response) {
      var promise = buses.command.broadcast('addAccountCommand', request.body);
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

module.exports = AccountsResource;
