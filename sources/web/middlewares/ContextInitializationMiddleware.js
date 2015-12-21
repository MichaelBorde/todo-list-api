'use strict';

function ContextInitializationMiddleware() {
  this.configure = configure;

  function configure(application) {
    application.all('*', initialiseLeContexte);
  }

  function initialiseLeContexte(request, response, next) {
    request.context = {};
    next();
  }
}

module.exports = ContextInitializationMiddleware;
