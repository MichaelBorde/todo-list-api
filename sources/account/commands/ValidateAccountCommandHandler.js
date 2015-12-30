'use strict';

var util = require('util');
var BaseCommandHandler = require('@arpinum/backend').BaseCommandHandler;
var AccountValidator = require('../AccountValidator');

function ValidateAccountCommand(repositories, commandBus) {
  BaseCommandHandler.call(this, repositories, commandBus);

  this.run = run;

  function run(account) {
    return new AccountValidator(repositories).validate(account);
  }
}

util.inherits(ValidateAccountCommand, BaseCommandHandler);

module.exports = ValidateAccountCommand;
