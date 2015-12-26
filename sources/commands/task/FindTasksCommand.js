'use strict';

var util = require('util');
var BaseCommand = require('@arpinum/backend').BaseCommand;

function FindTasksCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(criteria) {
    return repositories.task.findAll(criteria);
  }
}

util.inherits(FindTasksCommand, BaseCommand);

module.exports = FindTasksCommand;
