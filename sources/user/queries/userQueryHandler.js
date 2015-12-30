'use strict';

var _ = require('lodash');

module.exports = function taskQuery(queryProcessor) {
  return function (query) {
    return queryProcessor.findFirst('users', query)
      .then(function (user) {
        return _.omit(user, 'password');
      });
  };
};

