'use strict';

var _s = require('underscore.string');
var Bluebird = require('bluebird');
var log = require('./log')(__filename);
var errors = require('./errors');

function CommandBus() {
  var listeners = {};
  var self = this;
  self.broadcast = broadcast;
  self.register = register;

  function broadcast(commandType) {
    log.debug('Broadcasting', commandType);
    var listener = listeners[commandType];
    if (!listener) {
      return rejectDueToNoListener(commandType);
    }
    return listener.run.apply(listener, Array.prototype.slice.call(arguments, 1));
  }

  function rejectDueToNoListener(typeCommande) {
    var message = _s.sprintf('No listener for %s', typeCommande);
    return Bluebird.reject(new errors.TechnicalError(message));
  }

  function register(commandType, command) {
    log.debug('Registering to command', commandType);
    if (listeners[commandType]) {
      var message = _s.sprintf('Impossible to add another listener for %s', commandType);
      throw new errors.TechnicalError(message);
    }
    listeners[commandType] = command;
  }
}

module.exports = CommandBus;
