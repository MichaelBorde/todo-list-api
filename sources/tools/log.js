'use strict';

var configuration = require('../configuration');
var LoggerFactory = require('@arpinum/backend').LoggerFactory;

var factory = new LoggerFactory({level: configuration.logLevel});

module.exports = factory.create;
