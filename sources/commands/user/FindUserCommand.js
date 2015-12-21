'use strict';

var util = require('util');
var BaseCommand = require('./../BaseCommand');
var _ = require('lodash');

function FindUserCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(userSearch) {
    return repositories.user.findFirst(userSearch)
      .then(function (user) {
        return _.omit(user, 'password');
      });
  }
}

util.inherits(FindUserCommand, BaseCommand);

module.exports = FindUserCommand;
