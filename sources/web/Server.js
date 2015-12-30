'use strict';

var Bluebird = require('bluebird');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var UnhandledErrorMiddleware = require('@arpinum/backend').UnhandledErrorMiddleware;
var CommandBus = require('@arpinum/backend').CommandBus;
var QueryBus = require('@arpinum/backend').QueryBus;
var MongoDatabase = require('@arpinum/backend').MongoDatabase;
var QueryProcessor = require('@arpinum/backend').QueryProcessor;
var RepositoryInitializer = require('@arpinum/backend').RepositoryInitializer;
var CommandHandlerInitializer = require('@arpinum/backend').CommandHandlerInitializer;
var QueryHandlerInitializer = require('@arpinum/backend').QueryHandlerInitializer;
var ResourceInitializer = require('@arpinum/backend').ResourceInitializer;
var Router = require('./Router');
var configuration = require('../configuration');
var log = require('../tools/log')(__filename);
var morgan = require('morgan');
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
    var buses = {
      command: new CommandBus({log: log}),
      query: new QueryBus({log: log})
    };
    initializeExpress();

    var database = new MongoDatabase({
      log: log,
      databaseLogLevel: configuration.databaseLogLevel,
      databaseUrl: configuration.databaseUrl
    });
    return database.initialize()
      .then(initializeResources)
      .then(initializeRouting)
      .then(initializeRepositories)
      .then(initializeCommands)
      .then(initializeQueries);

    function initializeExpress() {
      app = express();
      if (configuration.withHttpLog) {
        app.use(morgan('combined'));
      }
      app.use(cors({
        origin: configuration.corsOrigin,
        credentials: true
      }));
      app.use(bodyParser.json());
      app.use(cookieParser());
    }

    function initializeResources() {
      return new ResourceInitializer(buses, moduleInitializerOptions()).initialize();
    }

    function initializeRouting(resources) {
      return Bluebird.try(function () {
        new ContextInitializationMiddleware(buses).configure(app);
        new AuthenticationMiddleware(buses).configure(app);
        new UserMiddleware(buses).configure(app);
        new AuthorizationMiddleware(buses).configure(app);
        new Router(resources).configure(app);
        new UnhandledErrorMiddleware({log: log, verboseWebErrors: configuration.verboseWebErrors}).configure(app);
      });
    }

    function initializeRepositories() {
      return new RepositoryInitializer(database, moduleInitializerOptions()).initialize();
    }

    function initializeCommands(repositories) {
      return new CommandHandlerInitializer(repositories, buses.command, moduleInitializerOptions()).initialize();
    }

    function initializeQueries() {
      var queryProcessor = new QueryProcessor(database);
      return new QueryHandlerInitializer(queryProcessor, buses.query, moduleInitializerOptions()).initialize();
    }

    function moduleInitializerOptions() {
      return {
        log: log,
        rootDirectory: './sources'
      };
    }
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
