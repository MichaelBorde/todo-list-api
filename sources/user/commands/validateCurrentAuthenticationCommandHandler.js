'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var FunctionalError = require('@arpinum/backend').FunctionalError;

module.exports = function (repositories, buses) {
  return function (command) {
    return users().then(function (results) {
      if (_.isEmpty(results)) {
        return Bluebird.reject(new FunctionalError('Invalid user'));
      }
      buses.event.broadcast('authenticationValidated', {email: command.email});
    });

    function users() {
      return repositories.user.findAll({email: command.email});
    }
  };
};
