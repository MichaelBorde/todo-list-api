'use strict';

function Erreurs() {
  this.WebError = require('./WebError');
  this.ClientError = require('./ClientError');
  this.ServerError = require('./ServerError');
  this.UnauthorizedError = require('./UnauthorizedError');
  this.ResourceNotFoundError = require('./ResourceNotFoundError');
  this.ConflictingResourceError = require('./ConflictingResourceError');
}

module.exports = new Erreurs();
