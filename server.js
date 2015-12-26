'use strict';

var Bluebird = require('bluebird');
var CommandBus = require('@arpinum/toolbox').CommandBus;
var Database = require('./sources/infrastructure/Database');
var Repositories = require('./sources/repositories/index');
var Commands = require('./sources/commands/index');
var Server = require('./sources/web/Server');
var log = require('./sources/tools/log')(__filename);

function Program() {
  var commandBus = new CommandBus({log: log});

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

