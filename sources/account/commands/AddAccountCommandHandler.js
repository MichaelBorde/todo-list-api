'use strict';

var util = require('util');
var BaseCommandHandler = require('@arpinum/backend').BaseCommandHandler;
var ConflictingEntityError = require('@arpinum/backend').ConflictingEntityError;
var AccountFactory = require('../AccountFactory');
var AccountValidator = require('../AccountValidator');

function AddAccountCommand(repositories, commandBus) {
  BaseCommandHandler.call(this, repositories, commandBus);

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

util.inherits(AddAccountCommand, BaseCommandHandler);

module.exports = AddAccountCommand;
