'use strict';

var executeLocal = require('building').shell.executeLocal;
var gap = require('grunt-as-promised');

module.exports = function (grunt) {
  gap.configure(grunt);

  grunt.registerPromiseTask('noLog', function () {
    process.env.TODO_LIST_API__LOG_LEVEL = 'OFF';
    process.env.ARPINUM_BACKEND__LOG_LEVEL = 'OFF';
  });

  grunt.registerPromiseTask('eslint', function () {
    return executeLocal('eslint', ['.']);
  });

  grunt.registerPromiseTask('mocha', function () {
    return executeLocal('mocha', ['--colors', '--reporter', 'spec', '--recursive', 'sources']);
  });

  grunt.registerPromiseTask('live', function () {
    return executeLocal(
      'forever', [
        '-m', '5',
        '-w', '--watchDirectory', 'sources',
        '--minUptime', '2000', '--spinSleepTime', '5000',
        'server.js']);
  });

  grunt.registerPromiseTask('testWatch', function () {
    return executeLocal('watch', ['--wait', '1', 'npm test', 'sources']);
  });

  grunt.registerTask('test', ['noLog', 'mocha']);
  grunt.registerTask('tdd', ['noLog', 'testWatch']);
  grunt.registerTask('default', ['eslint', 'test']);
};
