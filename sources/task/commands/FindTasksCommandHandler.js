'use strict';

var util = require('util');
var BaseCommandHandler = require('@arpinum/backend').BaseCommandHandler;

function FindTasksCommand(repositories, commandBus) {
  BaseCommandHandler.call(this, repositories, commandBus);

  this.run = run;

  function run(criteria) {
    return repositories.task.findAll(criteria);
  }
}

util.inherits(FindTasksCommand, BaseCommandHandler);

module.exports = FindTasksCommand;
