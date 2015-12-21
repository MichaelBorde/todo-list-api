'use strict';

var errors = require('../tools/errors');

function BaseCommand(repositories, commandBus) {
  var self = this;
  self.run = run;
  self.registerToBus = registerToBus;

  function run() {
    throw new errors.TechnicalError('To define');
  }

  function registerToBus() {
    commandBus.register(self.constructor.name, self);
  }
}

module.exports = BaseCommand;
