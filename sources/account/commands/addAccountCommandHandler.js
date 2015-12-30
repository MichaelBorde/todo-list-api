'use strict';

var ConflictingEntityError = require('@arpinum/backend').ConflictingEntityError;
var AccountFactory = require('../AccountFactory');
var AccountValidator = require('../AccountValidator');

module.exports = function (repositories) {
  return function (account) {
    return new AccountValidator(repositories).validate(account).then(function (validation) {
      if (!validation.valid) {
        throw new ConflictingEntityError();
      }
      return new AccountFactory(repositories).create(account).then(function (newAccount) {
        return {id: newAccount.id};
      });
    });
  };
};
