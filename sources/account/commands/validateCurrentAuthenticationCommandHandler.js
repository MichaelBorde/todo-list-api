'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var FunctionalError = require('@arpinum/backend').FunctionalError;

module.exports = function (repositories) {
  return function (authentication) {
    return accounts()
      .then(function (results) {
        if (_.isEmpty(results)) {
          return Bluebird.reject(new FunctionalError('Invalid account'));
        }
      });

    function accounts() {
      return repositories.account.findAll({email: authentication.email});
    }
  };
};
