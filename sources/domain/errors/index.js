'use strict';

function Errors() {
  this.EntityNotFoundError = require('./EntityNotFoundError');
  this.ConflictingEntityError = require('./ConflictingEntityError');
}

module.exports = new Errors();
