'use strict';

var util = require('util');
var errors = require('../../tools/errors/index');

function ConflictingEntityError(message) {
  errors.FunctionalError.call(this, message);
}

util.inherits(ConflictingEntityError, errors.FunctionalError);

module.exports = ConflictingEntityError;
