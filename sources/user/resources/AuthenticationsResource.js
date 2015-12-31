'use strict';

var _ = require('lodash');
var UnauthorizedError = require('@arpinum/backend').UnauthorizedError;
var BodyValidator = require('@arpinum/backend').BodyValidator;
var TokenService = require('@arpinum/backend').TokenService;
var configuration = require('../../configuration');

function AuthenticationsResource(buses) {
  var self = this;
  self.post = post;

  function post(request, response) {
    return new BodyValidator().promiseIfBodyIsValid({
      schema: authenticationSchema(),
      request: request,
      response: response,
      errorMessage: 'Invalid authentication',
      promise: validPost
    }).catch(function (error) {
      throw new UnauthorizedError(error.message);
    });

    function validPost(request, response) {
      var promise = buses.command.broadcast('authenticateCommand', request.body);
      return promise.then(function () {
        var cookieOptions = optionsCookieDepuis(request.body);
        response.cookie('jwtToken', createJwtToken(request.body), cookieOptions);
        response.end();
      });
    }

    function createJwtToken(user) {
      return tokenService().create(user);
    }

    function tokenService() {
      return new TokenService({
        expirationInMinutes: configuration.authenticationExpirationInMinutes,
        secret: configuration.jwtSecret
      });
    }

    function optionsCookieDepuis(authentication) {
      return _.merge({
          httpOnly: true,
          secure: configuration.securedCookie
        },
        optionExpiration(authentication));
    }

    function optionExpiration(authentication) {
      if (!authentication.toRemember) {
        return {expires: 0};
      }
      return {maxAge: configuration.authenticationExpirationInMinutes * 1000 * 60};
    }

    function authenticationSchema() {
      return {
        type: 'object',
        properties: {
          email: {type: 'string', error: 'email is mandatory'},
          password: {type: 'string', error: 'password is mandatory'},
          toRemember: {type: 'boolean', optional: true}
        }
      };
    }
  }
}

module.exports = AuthenticationsResource;
