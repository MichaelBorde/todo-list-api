'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var UnauthorizedError = require('@arpinum/backend').UnauthorizedError;
var TokenService = require('../tools/TokenService');
var log = require('../../tools/log')(__filename);

function AuthenticationMiddleware(buses) {
  this.configure = configure;

  function configure(application) {
    application.all('*', getAuthenticationIfAny);
  }

  function getAuthenticationIfAny(request, response, next) {
    return Bluebird.try(function () {
      var encodedToken = encodedJwtTokenFrom(request);
      if (!encodedToken) {
        log.debug('No jwt token can be found in cookies');
        next();
      } else {
        return getAuthentication(encodedToken, request, next);
      }
    }).catch(function (error) {
      response.clearCookie('jwtToken');
      next(new UnauthorizedError(error.message));
    });

    function getAuthentication(encodedToken) {
      return new TokenService().verify(encodedToken)
        .then(function (decodedToken) {
          return validateAuthentication(decodedToken);
        });
    }

    function validateAuthentication(decodedToken) {
      return buses.command.broadcast('validateCurrentAuthenticationCommand', decodedToken)
        .then(function () {
          request.context.authentication = decodedToken;
          next();
        });
    }

    function encodedJwtTokenFrom(request) {
      if (_.isUndefined(request.cookies) || _.isUndefined(request.cookies.jwtToken)) {
        return null;
      }
      return request.cookies.jwtToken;
    }
  }
}

module.exports = AuthenticationMiddleware;
