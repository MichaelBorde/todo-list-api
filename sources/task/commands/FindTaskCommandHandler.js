'use strict';

var util = require('util');
var BaseCommandHandler = require('@arpinum/backend').BaseCommandHandler;

function FindTaskCommand(repositories, commandBus) {
  BaseCommandHandler.call(this, repositories, commandBus);

  this.run = run;

  function run(task) {
    return repositories.task.findFirst(task);
  }
}

util.inherits(FindTaskCommand, BaseCommandHandler);

module.exports = FindTaskCommand;
