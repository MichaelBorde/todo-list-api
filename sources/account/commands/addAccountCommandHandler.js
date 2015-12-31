'use strict';

var ConflictingEntityError = require('@arpinum/backend').ConflictingEntityError;
var AccountValidator = require('../AccountValidator');
var AccountFactory = require('../AccountFactory');

module.exports = function (repositories, buses) {
  return function (command) {
    return new AccountValidator(repositories).validate(command).then(function (validation) {
      if (!validation.valid) {
        throw new ConflictingEntityError();
      }

      return new AccountFactory(repositories).create(command).then(function (createdAccount) {
        buses.event.broadcast('accountAddedEvent', createdAccount);
      });
    });
  };
};
