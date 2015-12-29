'use strict';

var util = require('util');
var BaseCommand = require('@arpinum/backend').BaseCommand;

function AddTaskCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(task) {
    return repositories.task.add(task);
  }
}

util.inherits(AddTaskCommand, BaseCommand);

module.exports = AddTaskCommand;
