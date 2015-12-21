'use strict';

var Bluebird = require('bluebird');
var glob = Bluebird.promisify(require('glob'));
var log = require('../tools/log')(__filename);

function Commands(repositories, commandBus) {
  this.registerCommandsToBus = registerCommandsToBus;

  function registerCommandsToBus() {
    return glob(__dirname + '/**/*Command.js').each(function (module) {
      var command = new (require(module))(repositories, commandBus);
      log.debug('Bus registration for', command.constructor.name);
      command.registerToBus();
    });
  }
}

module.exports = Commands;
