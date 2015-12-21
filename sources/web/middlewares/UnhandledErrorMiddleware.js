'use strict';

var _s = require('underscore.string');
var errors = require('../../tools/errors');
var webErrors = require('../errors');
var repositoriesErrors = require('../../domain/errors');
var configuration = require('../../tools/configuration');
var log = require('../../tools/log')(__filename);

function UnhandledErrorMiddleware() {
  this.configure = configure;

  function configure(application) {
    /*eslint no-unused-vars: 0*/
    application.use(function (error, request, response, next) {
      logErreur(error);
      var webError = webErrorFrom(error);
      response
        .status(webError.code)
        .send({error: webError.message});
    });
  }

  function logErreur(error) {
    log.error(_s.sprintf('Unhandled error (%s)', error.stack || error.message));
  }

  function webErrorFrom(error) {
    if (isA(error, repositoriesErrors.EntityNotFoundError)) {
      return new webErrors.ResourceNotFoundError(error.message);
    }
    if (isA(error, repositoriesErrors.ConflictingEntityError)) {
      return new webErrors.ConflictingResourceError(error.message);
    }
    if (isA(error, webErrors.WebError)) {
      return error;
    }
    if (isA(error, errors.FunctionalError)) {
      return new webErrors.ClientError(error.message);
    }
    return serverErrorFrom(error);
  }

  function serverErrorFrom(error) {
    var message = configuration.verboseWebErrors ? error.message : null;
    return new webErrors.ServerError(message);
  }

  function isA(error, constructor) {
    return error instanceof constructor;
  }
}

module.exports = UnhandledErrorMiddleware;
