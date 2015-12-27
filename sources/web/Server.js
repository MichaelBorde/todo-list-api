'use strict';

var Bluebird = require('bluebird');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var UnhandledErrorMiddleware = require('@arpinum/backend').UnhandledErrorMiddleware;
var CommandBus = require('@arpinum/backend').CommandBus;
var MongoDatabase = require('@arpinum/backend').MongoDatabase;
var Router = require('./Router');
var configuration = require('../configuration');
var log = require('../tools/log')(__filename);
var log4js = require('log4js');
var ContextInitializationMiddleware = require('./middlewares/ContextInitializationMiddleware');
var AuthenticationMiddleware = require('./middlewares/AuthenticationMiddleware');
var UserMiddleware = require('./middlewares/UserMiddleware');
var AuthorizationMiddleware = require('./middlewares/AuthorizationMiddleware');
var Repositories = require('../repositories');
var Commands = require('../commands');

function Server() {
  var self = this;
  var commandBus = new CommandBus({log: log});
  var app = express();
  var expressServer;

  app.use(log4js.connectLogger(log, {level: 'auto'}));
  app.use(cors({
    origin: configuration.corsOrigin,
    credentials: true
  }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  new ContextInitializationMiddleware(commandBus).configure(app);
  new AuthenticationMiddleware(commandBus).configure(app);
  new UserMiddleware(commandBus).configure(app);
  new AuthorizationMiddleware(commandBus).configure(app);
  new Router(commandBus).configure(app);
  new UnhandledErrorMiddleware({log: log, verboseWebErrors: configuration.verboseWebErrors}).configure(app);

  self.start = start;
  self.stop = stop;
  self.root = root;

  function start() {
    return initialize().then(startServer);
  }

  function initialize() {
    var database = new MongoDatabase({
      log: log,
      databaseLogLevel: configuration.databaseLogLevel,
      databaseUrl: configuration.databaseUrl
    });
    var repositories = new Repositories(database);
    return Bluebird.all([
      initializeCommands(repositories),
      database.initialize()
    ]);
  }

  function initializeCommands(repositories) {
    var commands = new Commands(repositories, commandBus);
    return commands.registerCommandsToBus();
  }

  function startServer() {
    return new Bluebird(function (resolve) {
      expressServer = app.listen(configuration.serverPort, function () {
        log.info('Server started at', self.root());
        resolve();
      });
    });
  }

  function stop() {
    return new Bluebird(function (resolve) {
      var serverRoot = self.root();
      expressServer.close(function () {
        log.info('Server stopped at', serverRoot);
        resolve();
      });
    });
  }

  function root() {
    return 'http://localhost:' + expressServer.address().port;
  }
}

module.exports = Server;
