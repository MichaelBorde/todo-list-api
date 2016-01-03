'use strict';

var QueriedObjectNotFoundError = require('@arpinum/backend').QueriedObjectNotFoundError;

module.exports = function (projections) {
  return function (query) {
    return projections.user.findFirst(query).then(function (user) {
      if (!user) {
        throw new QueriedObjectNotFoundError(query);
      }
      return user;
    });
  };
};

