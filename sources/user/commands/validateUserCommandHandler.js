'use strict';

var UserValidator = require('../UserValidator');

module.exports = function (repositories) {
  return function (user) {
    return new UserValidator(repositories).validate(user);
  };
};
