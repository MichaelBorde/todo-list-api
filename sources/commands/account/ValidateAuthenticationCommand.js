'use strict';

var util = require('util');
var BaseCommand = require('./../BaseCommand');
var AuthenticationValidator = require('../../domain/account/AuthenticationValidator');

function ValidateAuthenticationCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(authentifcation) {
    return new AuthenticationValidator(repositories).validate(authentifcation);
  }
}

util.inherits(ValidateAuthenticationCommand, BaseCommand);

module.exports = ValidateAuthenticationCommand;
