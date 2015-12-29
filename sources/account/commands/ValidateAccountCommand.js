'use strict';

var util = require('util');
var BaseCommand = require('@arpinum/backend').BaseCommand;
var AccountValidator = require('../AccountValidator');

function ValidateAccountCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(account) {
    return new AccountValidator(repositories).validate(account);
  }
}

util.inherits(ValidateAccountCommand, BaseCommand);

module.exports = ValidateAccountCommand;
