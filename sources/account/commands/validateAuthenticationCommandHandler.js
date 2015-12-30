'use strict';

var AuthenticationValidator = require('../AuthenticationValidator');

module.exports = function validateauthenticationCommand(repositories) {
  return function run(authentifcation) {
    return new AuthenticationValidator(repositories).validate(authentifcation);
  };
};
