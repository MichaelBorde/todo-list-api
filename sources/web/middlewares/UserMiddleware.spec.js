'use strict';

var should = require('chai').should();
var Bluebird = require('bluebird');
var _ = require('lodash');
var CommandBus = require('@arpinum/backend').CommandBus;
var FakeApplication = require('@arpinum/backend').FakeApplication;
var UserMiddleware = require('./UserMiddleware');
var constants = require('../../test/constants');

describe('The user middleware', function () {
  var application;
  var middleware;
  var nextMiddlewareCalled;
  var nextMiddlewareArgs;
  var commandBus;

  beforeEach(function () {
    application = new FakeApplication();
    commandBus = new CommandBus();
    middleware = new UserMiddleware(commandBus);
    middleware.configure(application);
    nextMiddlewareCalled = false;
    nextMiddlewareArgs = [];
  });

  beforeEach(function () {
    commandBus.register('findUserCommand', function (criteria) {
      if (!_.isEqual(criteria, {email: constants.EMAIL})) {
        return Bluebird.reject('Entity not found');
      }
      return Bluebird.resolve(constants.USER);
    });
  });

  it('should configure the application with a middleware', function () {
    application.allArguments.should.have.lengthOf(2);
    configuredRoute().should.equal('*');
  });

  it('should put the current user in context then call the next middleware', function () {
    var request = {
      url: '/toto',
      context: {authentication: constants.DECODED_JWT_TOKEN}
    };

    var promise = middlewareFunction()(request, {}, nextMiddleware);

    return promise.then(function () {
      nextMiddlewareCalled.should.be.true;
      nextMiddlewareArgs.should.be.empty;
      should.exist(request.context.user);
      request.context.user.should.deep.equal(constants.USER);
    });
  });

  it('should call the next middleware though current user cannot be found', function () {
    var request = {
      url: '/toto',
      context: {}
    };

    var promise = middlewareFunction()(request, {}, nextMiddleware);

    return promise.then(function () {
      nextMiddlewareCalled.should.be.true;
      nextMiddlewareArgs.should.be.empty;
      should.not.exist(request.context.user);
    });
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
