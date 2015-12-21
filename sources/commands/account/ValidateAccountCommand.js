'use strict';

var util = require('util');
var BaseCommand = require('./../BaseCommand');
var AccountValidator = require('../../domain/account/AccountValidator');

function ValidateAccountCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(account) {
    return new AccountValidator(repositories).validate(account);
  }
}

util.inherits(ValidateAccountCommand, BaseCommand);

module.exports = ValidateAccountCommand;
