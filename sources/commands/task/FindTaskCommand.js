'use strict';

var util = require('util');
var BaseCommand = require('./../BaseCommand');

function FindTaskCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(task) {
    return repositories.task.findFirst(task);
  }
}

util.inherits(FindTaskCommand, BaseCommand);

module.exports = FindTaskCommand;
