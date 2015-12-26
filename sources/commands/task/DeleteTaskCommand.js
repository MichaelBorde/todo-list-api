'use strict';

var util = require('util');
var BaseCommand = require('@arpinum/backend').BaseCommand;

function DeleteTaskCommand(repositories, commandBus) {
  BaseCommand.call(this, repositories, commandBus);

  this.run = run;

  function run(id) {
    return repositories.task
      .delete({id: id})
      .return();
  }
}

util.inherits(DeleteTaskCommand, BaseCommand);

module.exports = DeleteTaskCommand;
