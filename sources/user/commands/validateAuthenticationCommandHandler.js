'use strict';

var AuthenticationValidator = require('../AuthenticationValidator');

module.exports = function validateauthenticationCommand(repositories) {
  return function (authentifcation) {
    return new AuthenticationValidator(repositories).validate(authentifcation);
  };
};
