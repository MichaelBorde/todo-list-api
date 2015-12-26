'use strict';

var executeLocal = require('building').shell.executeLocal;

module.exports = function (cluck) {

  cluck.withTask('noLog').doing(function () {
    process.env.TODO_LIST_API__LOG_LEVEL = 'OFF';
    process.env.ARPINUM_BACKEND__LOG_LEVEL = 'OFF';
  });

  cluck.withTask('eslint').doing(function () {
    return executeLocal('eslint', ['.']);
  });

  cluck.withTask('mocha').doing(function () {
    return executeLocal('mocha', ['--colors', '--reporter', 'spec', '--recursive', 'sources']);
  });

  cluck.withTask('live').doing(function () {
    return executeLocal(
      'forever', [
        '-m', '5',
        '-w', '--watchDirectory', 'sources',
        '--minUptime', '2000', '--spinSleepTime', '5000',
        'server.js']);
  });

  cluck.withTask('testWatch').doing(function () {
    return executeLocal('watch', ['npm test', 'sources']);
  });

  cluck.withTask('test').doing('noLog', 'mocha');
  cluck.withTask('tdd').doing('noLog', 'testWatch');
  cluck.withTask('default').doing('eslint', 'test');
};
