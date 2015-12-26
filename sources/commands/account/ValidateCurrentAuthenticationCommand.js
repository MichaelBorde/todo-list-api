'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var util = require('util');
var BaseCommand = require('@arpinum/backend').BaseCommand;
var FunctionalError = require('@arpinum/backend').FunctionalError;

function ValidateCurrentAuthenticationCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(authentication) {
    return accounts()
      .then(function (results) {
        if (_.isEmpty(results)) {
          return Bluebird.reject(new FunctionalError('Invalid account'));
        }
      });

    function accounts() {
      return repositories.account.findAll({email: authentication.email});
    }
  }
}

util.inherits(ValidateCurrentAuthenticationCommand, BaseCommand);

module.exports = ValidateCurrentAuthenticationCommand;
