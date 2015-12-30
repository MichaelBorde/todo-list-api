'use strict';

var util = require('util');
var BaseCommandHandler = require('@arpinum/backend').BaseCommandHandler;

function DeleteTaskCommand(repositories, commandBus) {
  BaseCommandHandler.call(this, repositories, commandBus);

  this.run = run;

  function run(id) {
    return repositories.task
      .delete({id: id})
      .return();
  }
}

util.inherits(DeleteTaskCommand, BaseCommandHandler);

module.exports = DeleteTaskCommand;
