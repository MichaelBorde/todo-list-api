'use strict';

var util = require('util');
var BaseCommandHandler = require('@arpinum/backend').BaseCommandHandler;

function AddTaskCommand(repositories, commandBus) {
  BaseCommandHandler.call(this, repositories, commandBus);

  this.run = run;

  function run(task) {
    return repositories.task.add(task);
  }
}

util.inherits(AddTaskCommand, BaseCommandHandler);

module.exports = AddTaskCommand;
