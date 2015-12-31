'use strict';

var FunctionalError = require('@arpinum/backend').FunctionalError;
var AuthenticationValidator = require('../AuthenticationValidator');

module.exports = function (repositories, buses) {
  return function (command) {
    return new AuthenticationValidator(repositories).validate(command).then(function (validation) {
      if (!validation.valid) {
        throw new FunctionalError('Authentication failed');
      }
      buses.event.broadcast('userAuthenticated', {email: command.email});
    });
  };
};
