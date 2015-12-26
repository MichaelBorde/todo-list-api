'use strict';

var should = require('chai').should();
var _ = require('lodash');
var CommandBus = require('@arpinum/backend').CommandBus;
var FakeApplication = require('@arpinum/backend').FakeApplication;
var ContextInitializationMiddleware = require('./ContextInitializationMiddleware');

describe('The context initialization middleware', function () {
  var application;
  var middleware;
  var nextMiddlewareCalled;
  var nextMiddlewareArgs;
  var commandBus;

  beforeEach(function () {
    application = new FakeApplication();
    commandBus = new CommandBus();
    middleware = new ContextInitializationMiddleware(commandBus);
    middleware.configure(application);
    nextMiddlewareCalled = false;
    nextMiddlewareArgs = [];
  });

  it('should configure the application with a middleware', function () {
    application.allArguments.should.have.lengthOf(2);
    configuredRoute().should.equal('*');
  });

  it('should create the context in the request and call the next middleware', function () {
    var request = {
      url: '/toto'
    };

    middlewareFunction()(request, {}, nextMiddleware);

    nextMiddlewareCalled.should.be.true;
    nextMiddlewareArgs.should.be.empty;
    should.exist(request.context);
  });

  function configuredRoute() {
    return application.allArguments[0];
  }

  function middlewareFunction() {
    return application.allArguments[1];
  }

  function nextMiddleware() {
    nextMiddlewareCalled = true;
    nextMiddlewareArgs = _.toArray(arguments);
  }
});
