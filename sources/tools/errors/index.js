'use strict';

function Erreurs() {
  this.FunctionalError = require('./FunctionalError');
  this.TechnicalError = require('./TechnicalError');
}

module.exports = new Erreurs();
