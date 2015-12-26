'use strict';

var _ = require('lodash');
var UnauthorizedError = require('@arpinum/backend').UnauthorizedError;

function AuthorizationMiddleware() {
  this.configure = configure;
  var urlsWithoutAuthentication = [
    '/authentications',
    '/authentications/validations',
    '/authentications/current',
    '/accounts',
    '/accounts/validations'
  ];

  function configure(application) {
    application.all('*', checkAuthenticationIfRequired);
  }

  function checkAuthenticationIfRequired(request, response, next) {
    if (_.includes(urlsWithoutAuthentication, request.url)) {
      next();
    } else {
      return checkAuthentication(request, response, next);
    }
  }

  function checkAuthentication(request, response, next) {
    if (!request.context.authentication) {
      next(new UnauthorizedError());
    } else {
      next();
    }
  }
}

module.exports = AuthorizationMiddleware;
