'use strict';

var Bluebird = require('bluebird');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var UnhandledErrorMiddleware = require('@arpinum/backend').UnhandledErrorMiddleware;
var CommandBus = require('@arpinum/backend').CommandBus;
var MongoDatabase = require('@arpinum/backend').MongoDatabase;
var RepositoryInitializer = require('@arpinum/backend').RepositoryInitializer;
var CommandInitializer = require('@arpinum/backend').CommandInitializer;
var ResourceInitializer = require('@arpinum/backend').ResourceInitializer;
var Router = require('./Router');
var configuration = require('../configuration');
var log = require('../tools/log')(__filename);
var log4js = require('log4js');
var ContextInitializationMiddleware = require('./middlewares/ContextInitializationMiddleware');
var AuthenticationMiddleware = require('./middlewares/AuthenticationMiddleware');
var UserMiddleware = require('./middlewares/UserMiddleware');
var AuthorizationMiddleware = require('./middlewares/AuthorizationMiddleware');

function Server() {
  var self = this;
  var app;
  var expressServer;

  self.start = start;
  self.stop = stop;
  self.root = root;

  function start() {
    return initialize().then(startServer);
  }

  function initialize() {
    var commandBus = new CommandBus({log: log});
    initializeExpress();

    var database = new MongoDatabase({
      log: log,
      databaseLogLevel: configuration.databaseLogLevel,
      databaseUrl: configuration.databaseUrl
    });
    return initializeResources(commandBus)
      .then(function (resources) {
        initializeRouting(commandBus, resources);
      })
      .then(function () {
        return initializeRepositories(database);
      })
      .then(function (repositories) {
        return initializeCommands(repositories, commandBus);
      })
      .then(database.initialize);
  }

  function initializeExpress() {
    app = express();
    app.use(log4js.connectLogger(log, {level: 'auto'}));
    app.use(cors({
      origin: configuration.corsOrigin,
      credentials: true
    }));
    app.use(bodyParser.json());
    app.use(cookieParser());
  }

  function initializeResources(commandBus) {
    return new ResourceInitializer(commandBus, {
      log: log,
      rootDirectory: './sources'
    }).initialize();
  }

  function initializeRouting(commandBus, resources) {
    new ContextInitializationMiddleware(commandBus).configure(app);
    new AuthenticationMiddleware(commandBus).configure(app);
    new UserMiddleware(commandBus).configure(app);
    new AuthorizationMiddleware(commandBus).configure(app);
    new Router(resources).configure(app);
    new UnhandledErrorMiddleware({log: log, verboseWebErrors: configuration.verboseWebErrors}).configure(app);
  }

  function initializeRepositories(database) {
    return new RepositoryInitializer(database, {
      log: log,
      rootDirectory: './sources'
    }).initialize();
  }

  function initializeCommands(repositories, commandBus) {
    return new CommandInitializer(repositories, commandBus, {
      log: log,
      rootDirectory: './sources'
    }).initialize();
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
