'use strict';

var config = require('12factor-config');

module.exports = config({
  serverPort: {
    env: 'PORT',
    type: 'integer',
    default: '8081'
  },
  logLevel: {
    env: 'TODO_LIST_API__LOG_LEVEL',
    type: 'string',
    default: 'debug',
    values: ['error', 'info', 'debug']
  },
  withHttpLog: {
    env: 'TODO_LIST_API__WITH_HTTP_LOG',
    type: 'boolean',
    default: 'true'
  },
  databaseLogLevel: {
    env: 'TODO_LIST_API__DB_LOG_LEVEL',
    type: 'string',
    default: 'info',
    values: ['error', 'info', 'debug']
  },
  verboseWebErrors: {
    env: 'TODO_LIST_API__VERBOSE_WEB_ERRORS',
    type: 'boolean',
    default: 'true'
  },
  databaseUrl: {
    env: 'TODO_LIST_API__DB_URL',
    type: 'string',
    default: 'mongodb://localhost:27017/todo-list'
  },
  jwtSecret: {
    env: 'TODO_LIST_API__JWT_SECRET',
    type: 'string',
    default: 'jwtSecret'
  },
  securedCookie: {
    env: 'TODO_LIST_API__SECURED_JWT_COOKIE',
    type: 'boolean',
    default: 'false'
  },
  authenticationExpirationInMinutes: {
    env: 'TODO_LIST_API__AUTHENTICATION_TIMEOUT_IN_MINUTES',
    type: 'integer',
    default: '10080'
  },
  corsOrigin: {
    env: 'TODO_LIST_API__CORS_ORIGIN',
    type: 'string',
    default: 'http://localhost:8080'
  }
});
