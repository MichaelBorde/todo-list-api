'use strict';

var util = require('util');
var FunctionalError = require('@arpinum/backend').FunctionalError;
var AuthenticationValidator = require('../AuthenticationValidator');
var BaseCommandHandler = require('@arpinum/backend').BaseCommandHandler;

function AuthenticationCommand(repositories, commandBus) {
  BaseCommandHandler.call(this, repositories, commandBus);

  this.run = run;

  function run(authentication) {
    return new AuthenticationValidator(repositories).validate(authentication).then(function (validation) {
      if (!validation.valid) {
        throw new FunctionalError('Authentication failed');
      }
      return {email: authentication.email};
    });
  }
}

util.inherits(AuthenticationCommand, BaseCommandHandler);

module.exports = AuthenticationCommand;
