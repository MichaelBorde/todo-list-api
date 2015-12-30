'use strict';

var util = require('util');
var BaseCommandHandler = require('@arpinum/backend').BaseCommandHandler;

function UpdateTaskPartiallyCommand(repositories, commandBus) {
  BaseCommandHandler.call(this, repositories, commandBus);

  this.run = run;

  function run(task) {
    return repositories.task
      .update(task)
      .return();
  }
}

util.inherits(UpdateTaskPartiallyCommand, BaseCommandHandler);

module.exports = UpdateTaskPartiallyCommand;
