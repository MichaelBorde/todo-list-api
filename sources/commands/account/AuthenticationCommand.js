'use strict';

var util = require('util');
var BaseCommand = require('../BaseCommand');
var errors = require('../../tools/errors/index');
var AuthenticationValidator = require('../../domain/account/AuthenticationValidator');

function AuthenticationCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(authentication) {
    return new AuthenticationValidator(repositories).validate(authentication).then(function (validation) {
      if (!validation.valid) {
        throw new errors.FunctionalError('Authentication failed');
      }
      return {email: authentication.email};
    });
  }
}

util.inherits(AuthenticationCommand, BaseCommand);

module.exports = AuthenticationCommand;
