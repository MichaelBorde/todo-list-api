'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var FunctionalError = require('@arpinum/backend').FunctionalError;

module.exports = function (repositories) {
  return function (authentication) {
    return users()
      .then(function (results) {
        if (_.isEmpty(results)) {
          return Bluebird.reject(new FunctionalError('Invalid user'));
        }
      });

    function users() {
      return repositories.user.findAll({email: authentication.email});
    }
  };
};
