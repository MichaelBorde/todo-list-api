'use strict';

function Middlewares(commandBus) {
  this.contextInitialization = new (require('./ContextInitializationMiddleware'))(commandBus);
  this.authentication = new (require('./AuthenticationMiddleware'))(commandBus);
  this.user = new (require('./UserMiddleware'))(commandBus);
  this.authorization = new (require('./AuthorizationMiddleware'))(commandBus);
  this.unhandledError = new (require('./UnhandledErrorMiddleware'))(commandBus);
}

module.exports = Middlewares;
