'use strict';

require('chai').should();
var FakeApplication = require('../../test/FakeApplication');
var FakeResponse = require('../../test/FakeResponse');
var UnhandledErrorMiddleware = require('./UnhandledErrorMiddleware');
var errors = require('../../tools/errors');
var webErrors = require('../errors');
var repositoriesErrors = require('../../domain/errors');
var configuration = require('../../tools/configuration');

describe('The unhandled error middleware', function () {
  var application;
  var response;
  var middleware;

  beforeEach(function () {
    application = new FakeApplication();
    response = new FakeResponse();
    middleware = new UnhandledErrorMiddleware();
    middleware.configure(application);
  });

  it('configure the application with a middleware', function () {
    application.middlewares.should.have.lengthOf(1);
  });

  it('should send a server error by default', function () {
    var error = new Error('the error');
    configuration.verboseWebErrors = true;

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(500);
    response.send.should.have.been.calledWith({error: 'the error'});
  });

  it('should hide the detailed message based on configuration', function () {
    var error = new errors.TechnicalError('very technical message');
    configuration.verboseWebErrors = false;

    application.middlewares[0](error, null, response);

    response.send.should.have.been.calledWith({error: 'Server error'});
  });

  it('should send a client error for functionnal errors', function () {
    var error = new errors.FunctionalError('badaboom');

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(400);
    response.send.should.have.been.calledWith({error: 'badaboom'});
  });

  it('should send a 404 for an entity not found error', function () {
    var error = new repositoriesErrors.EntityNotFoundError({id: '33'});

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(404);
    var message = 'No entity for ' + JSON.stringify({id: '33'});
    response.send.should.have.been.calledWith({error: message});
  });

  it('should send a 409 for a conflicting entity error', function () {
    var error = new repositoriesErrors.ConflictingEntityError();

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(409);
    response.send.should.have.been.calledWith({error: error.message});
  });

  it('should send the provided error code if present', function () {
    var error = new webErrors.ClientError('not found', 404);

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(404);
    response.send.should.have.been.calledWith({error: 'not found'});
  });
});
