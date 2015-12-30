'use strict';

var should = require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var Bluebird = require('bluebird');
var _ = require('lodash');
var CommandBus = require('@arpinum/backend').CommandBus;
var FakeApplication = require('@arpinum/backend').FakeApplication;
var FakeResponse = require('@arpinum/backend').FakeResponse;
var AuthenticationMiddleware = require('./AuthenticationMiddleware');
var constants = require('../../test/constants');

describe('The authentication middleware', function () {
  var application;
  var middleware;
  var nextMiddlewareCalled;
  var nextMiddlewareArgs;
  var commandBus;

  beforeEach(function () {
    application = new FakeApplication();
    commandBus = new CommandBus();
    middleware = new AuthenticationMiddleware(commandBus);
    middleware.configure(application);
    nextMiddlewareCalled = false;
    nextMiddlewareArgs = [];
  });

  beforeEach(function () {
    commandBus.register('validateCurrentAuthenticationCommand', function (jeton) {
      if (!_.isEqual(jeton, constants.DECODED_JWT_TOKEN)) {
        return Bluebird.reject('Invalid token');
      }
      return Bluebird.resolve();
    });
  });

  it('should configure the application with a middleware', function () {
    application.allArguments.should.have.lengthOf(2);
    configuredRoute().should.equal('*');
  });

  it('should call next middleware after authentication', function () {
    var request = {
      url: '/toto',
      cookies: {
        jwtToken: constants.ENCODED_JWT_TOKEN
      },
      context: {}
    };

    var promise = middlewareFunction()(request, {}, nextMiddleware);

    return promise.then(function () {
      nextMiddlewareCalled.should.be.true;
      nextMiddlewareArgs.should.be.empty;
      should.exist(request.context.authentication);
      request.context.authentication.should.deep.equal(constants.DECODED_JWT_TOKEN);
    });
  });

  it('should call next middleware though there is no authenticationr', function () {
    var request = {
      url: '/toto',
      context: {}
    };

    var promise = middlewareFunction()(request, {}, nextMiddleware);

    return promise.then(function () {
      nextMiddlewareCalled.should.be.true;
      nextMiddlewareArgs.should.be.empty;
      should.not.exist(request.context.authentication);
    });
  });

  it('should call next middleware with error if authentication fails', function () {
    var request = {
      url: '/toto',
      cookies: {
        jwtToken: 'wrong token'
      }
    };
    var response = new FakeResponse();

    var promise = middlewareFunction()(request, response, nextMiddleware);

    return promise.then(function () {
      nextMiddlewareCalledWith401();
      response.clearCookie.should.have.been.calledWith('jwtToken');
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

  function nextMiddlewareCalledWith401() {
    nextMiddlewareArgs.should.have.lengthOf(1);
    nextMiddlewareArgs[0].code.should.equal(401);
  }
});
