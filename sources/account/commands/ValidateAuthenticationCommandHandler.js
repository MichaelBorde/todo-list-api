'use strict';

var util = require('util');
var BaseCommandHandler = require('@arpinum/backend').BaseCommandHandler;
var AuthenticationValidator = require('../AuthenticationValidator');

function ValidateAuthenticationCommand(repositories, commandBus) {
  BaseCommandHandler.call(this, repositories, commandBus);

  this.run = run;

  function run(authentifcation) {
    return new AuthenticationValidator(repositories).validate(authentifcation);
  }
}

util.inherits(ValidateAuthenticationCommand, BaseCommandHandler);

module.exports = ValidateAuthenticationCommand;
