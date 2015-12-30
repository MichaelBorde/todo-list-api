'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var util = require('util');
var BaseCommandHandler = require('@arpinum/backend').BaseCommandHandler;
var FunctionalError = require('@arpinum/backend').FunctionalError;

function ValidateCurrentAuthenticationCommand(repositories, commandBus) {
  BaseCommandHandler.call(this, repositories, commandBus);

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

util.inherits(ValidateCurrentAuthenticationCommand, BaseCommandHandler);

module.exports = ValidateCurrentAuthenticationCommand;
