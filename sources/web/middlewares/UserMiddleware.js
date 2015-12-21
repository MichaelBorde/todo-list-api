'use strict';

var Bluebird = require('bluebird');

function UserMiddleware(commandBus) {
  this.configure = configure;

  function configure(application) {
    application.all('*', getUserIfAuthentified);
  }

  function getUserIfAuthentified(request, response, next) {
    return Bluebird.try(function () {
      if (!request.context.authentication) {
        next();
      } else {
        return getUser(request, next);
      }
    });
  }

  function getUser(request, next) {
    return commandBus.broadcast('FindUserCommand', {email: request.context.authentication.email})
      .then(function (user) {
        request.context.user = user;
        next();
      });
  }
}

module.exports = UserMiddleware;
