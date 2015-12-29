'use strict';

var util = require('util');
var FunctionalError = require('@arpinum/backend').FunctionalError;
var AuthenticationValidator = require('../AuthenticationValidator');
var BaseCommand = require('@arpinum/backend').BaseCommand;

function AuthenticationCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

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

util.inherits(AuthenticationCommand, BaseCommand);

module.exports = AuthenticationCommand;
