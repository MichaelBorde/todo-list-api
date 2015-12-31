'use strict';

var ConflictingEntityError = require('@arpinum/backend').ConflictingEntityError;
var UserValidator = require('../UserValidator');
var UserFactory = require('../UserFactory');

module.exports = function (repositories, buses) {
  return function (command) {
    return new UserValidator(repositories).validate(command).then(function (validation) {
      if (!validation.valid) {
        throw new ConflictingEntityError();
      }

      return new UserFactory(repositories).create(command).then(function (createdUser) {
        buses.event.broadcast('userAddedEvent', createdUser);
      });
    });
  };
};
