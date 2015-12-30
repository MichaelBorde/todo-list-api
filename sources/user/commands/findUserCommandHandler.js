'use strict';

var _ = require('lodash');

module.exports = function (repositories) {
  return function (userSearch) {
    return repositories.user.findFirst(userSearch)
      .then(function (user) {
        return _.omit(user, 'password');
      });
  };
};
