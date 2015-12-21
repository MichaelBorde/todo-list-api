'use strict';

var util = require('util');
var errors = require('../../tools/errors/index');

function EntityNotFoundError(criteria) {
  var message = 'No entity for ' + JSON.stringify(criteria);
  errors.FunctionalError.call(this, message);
}

util.inherits(EntityNotFoundError, errors.FunctionalError);

module.exports = EntityNotFoundError;
