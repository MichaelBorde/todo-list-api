'use strict';

var _ = require('lodash');
var FakeApplication = require('../../test/FakeApplication');
var AuthorizationMiddleware = require('./AuthorizationMiddleware');
var constants = require('../../test/constants');

describe('The authorization middleware', function () {
  var application;
  var middleware;
  var nextMiddlewareCalled;
  var nextMiddlewareArgs;

  beforeEach(function () {
    application = new FakeApplication();
    middleware = new AuthorizationMiddleware();
    middleware.configure(application);
    nextMiddlewareCalled = false;
    nextMiddlewareArgs = [];
  });

  it('should configure the application with a middleware', function () {
    application.allArguments.should.have.lengthOf(2);
    configuredRoute().should.equal('*');
  });

  it('should call next middleware if authentication is provided', function () {
    var request = {
      url: '/required-authentication',
      context: {authentication: constants.DECODED_JWT_TOKEN}
    };

    middlewareFunction()(request, {}, nextMiddleware);

    nextMiddlewareCalled.should.be.true;
    nextMiddlewareArgs.should.be.empty;
  });

  it('should immediately call next middleware if url does not require authentication', function () {
    var request = {
      url: '/authentications',
      context: {}
    };

    middlewareFunction()(request, {}, nextMiddleware);

    nextMiddlewareCalled.should.be.true;
    nextMiddlewareArgs.should.be.empty;
  });

  it('should call next middleware with error if authentication is not provided but required', function () {
    var request = {
      url: '/authentication-required',
      context: {}
    };

    middlewareFunction()(request, {}, nextMiddleware);

    nextMiddlewareCalledWith401();
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

  function nextMiddlewareCalledWith401() {
    nextMiddlewareArgs.should.have.lengthOf(1);
    nextMiddlewareArgs[0].code.should.equal(401);
  }
});
