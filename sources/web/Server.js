'use strict';

var Bluebird = require('bluebird');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var UnhandledErrorMiddleware = require('@arpinum/backend').UnhandledErrorMiddleware;
var EventBus = require('@arpinum/backend').EventBus;
var EventStore = require('@arpinum/backend').EventStore;
var CommandBus = require('@arpinum/backend').CommandBus;
var QueryBus = require('@arpinum/backend').QueryBus;
var MongoDatabase = require('@arpinum/backend').MongoDatabase;
var RepositoryInitializer = require('@arpinum/backend').RepositoryInitializer;
var CommandHandlerInitializer = require('@arpinum/backend').CommandHandlerInitializer;
var QueryHandlerInitializer = require('@arpinum/backend').QueryHandlerInitializer;
var EventHandlerInitializer = require('@arpinum/backend').EventHandlerInitializer;
var ProjectionInitializer = require('@arpinum/backend').ProjectionInitializer;
var ResourceInitializer = require('@arpinum/backend').ResourceInitializer;
var Router = require('./Router');
var configuration = require('../configuration');
var log = require('../tools/log')(__filename);
var morgan = require('morgan');
var ContextInitializationMiddleware = require('./middlewares/ContextInitializationMiddleware');
var AuthenticationMiddleware = require('./../user/middlewares/AuthenticationMiddleware');
var UserMiddleware = require('./../user/middlewares/UserMiddleware');
var AuthorizationMiddleware = require('./middlewares/AuthorizationMiddleware');

function Server() {
  var self = this;
  var app;
  var expressServer;

  self.start = start;

  function start() {
    return initialize().then(startServer);
  }

  function initialize() {
    var buses = {
      event: new EventBus({log: log}),
      command: new CommandBus({log: log}),
      query: new QueryBus({log: log})
    };
    initializeExpress();

    var database;
    var resources;
    var repositories;
    var projections;

    return initializeDatabase()
      .then(initializeResources)
      .then(initializeRouting)
      .then(initializeRepositories)
      .then(initializeEvents)
      .then(initializeProjections)
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

    function initializeDatabase() {
      return Bluebird.try(function () {
        database = new MongoDatabase({
          log: log,
          databaseLogLevel: configuration.databaseLogLevel,
          databaseUrl: configuration.databaseUrl
        });
        return database.initialize();
      });
    }

    function initializeResources() {
      var initialize = new ResourceInitializer(buses, initializerOptions()).initialize();
      return initialize.then(function (r) {
        resources = r;
      });
    }

    function initializeRouting() {
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
      var initialize = new RepositoryInitializer(database, initializerOptions()).initialize();
      return initialize.then(function (r) {
        repositories = r;
      });
    }

    function initializeEvents() {
      new EventStore(database, {log: log}).catchEvents(buses.event);
      return new EventHandlerInitializer(repositories, buses, initializerOptions()).initialize();
    }

    function initializeProjections() {
      var initialize = new ProjectionInitializer(database, buses, initializerOptions()).initialize();
      return initialize.then(function (p) {
        projections = p;
      });
    }

    function initializeCommands() {
      return new CommandHandlerInitializer(repositories, buses, initializerOptions()).initialize();
    }

    function initializeQueries() {
      return new QueryHandlerInitializer(projections, buses, initializerOptions()).initialize();
    }

    function initializerOptions() {
      return {
        log: log,
        rootDirectory: './sources'
      };
    }
  }

  function startServer() {
    return new Bluebird(function (resolve) {
      expressServer = app.listen(configuration.serverPort, function () {
        log.info('Server started at', root());
        resolve();
      });
    });
  }

  function root() {
    return 'http://localhost:' + expressServer.address().port;
  }
}

module.exports = Server;
