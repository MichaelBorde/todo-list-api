'use strict';

var util = require('util');
var BaseCommand = require('@arpinum/backend').BaseCommand;
var ConflictingEntityError = require('@arpinum/backend').ConflictingEntityError;
var AccountFactory = require('../../domain/account/AccountFactory');
var AccountValidator = require('../../domain/account/AccountValidator');

function AddAccountCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(account) {
    return new AccountValidator(repositories).validate(account).then(function (validation) {
      if (!validation.valid) {
        throw new ConflictingEntityError();
      }
      return new AccountFactory(repositories).create(account).then(function (newAccount) {
        return {id: newAccount.id};
      });
    });
  }
}

util.inherits(AddAccountCommand, BaseCommand);

module.exports = AddAccountCommand;
