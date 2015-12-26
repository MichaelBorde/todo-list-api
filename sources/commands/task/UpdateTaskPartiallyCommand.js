'use strict';

var util = require('util');
var BaseCommand = require('@arpinum/backend').BaseCommand;

function UpdateTaskPartiallyCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(task) {
    return repositories.task
      .updatePartially(task)
      .return();
  }
}

util.inherits(UpdateTaskPartiallyCommand, BaseCommand);

module.exports = UpdateTaskPartiallyCommand;
