'use strict';

var Bluebird = require('bluebird');
var Database = require('../sources/infrastructure/Database');
var Repositories = require('../sources/repositories');
var Commands = require('../sources/commands');
var Server = require('../sources/web/Server');
var CommandBus = require('../sources/tools/CommandBus');
var log = require('../sources/tools/log')(__filename);

function Program() {
  var commandBus = new CommandBus();

  this.run = run;

  function run() {
    return Bluebird.try(function () {
      var database = new Database();
      var repositories = new Repositories(database);
      return initializeCommands()
        .then(waitForDependencies)
        .then(startServer);

      function initializeCommands() {
        var commands = new Commands(repositories, commandBus);
        return commands.registerCommandsToBus();
      }

      function waitForDependencies() {
        return Bluebird.all([
          database.initialize()
        ]);
      }

      function startServer() {
        var serveur = new Server(commandBus);
        return serveur.start();
      }

    }).catch(function (error) {
      log.error('Impossible to initialize server', error);
      process.exit(1);
    });
  }
}

if (require.main === module) {
  new Program().run();
}

module.exports = Program;

