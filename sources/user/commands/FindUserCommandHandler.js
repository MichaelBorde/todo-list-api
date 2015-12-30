'use strict';

var util = require('util');
var BaseCommandHandler = require('@arpinum/backend').BaseCommandHandler;
var _ = require('lodash');

function FindUserCommand(repositories, commandBus) {
  BaseCommandHandler.call(this, repositories, commandBus);

  this.run = run;

  function run(userSearch) {
    return repositories.user.findFirst(userSearch)
      .then(function (user) {
        return _.omit(user, 'password');
      });
  }
}

util.inherits(FindUserCommand, BaseCommandHandler);

module.exports = FindUserCommand;
