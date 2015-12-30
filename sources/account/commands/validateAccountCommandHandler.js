'use strict';

var AccountValidator = require('../AccountValidator');

module.exports = function (repositories) {
  return function (account) {
    return new AccountValidator(repositories).validate(account);
  };
};
