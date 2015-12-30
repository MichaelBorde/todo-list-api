'use strict';

var FunctionalError = require('@arpinum/backend').FunctionalError;
var AuthenticationValidator = require('../AuthenticationValidator');

module.exports = function (repositories) {
  return function (authentication) {
    return new AuthenticationValidator(repositories).validate(authentication).then(function (validation) {
      if (!validation.valid) {
        throw new FunctionalError('Authentication failed');
      }
      return {email: authentication.email};
    });
  };
};
