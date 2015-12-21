'use strict';

var shell = require('building').shell;

module.exports = function () {
  return shell.execute(
    'forever', [
      '-m', '5',
      '-w', '--watchDirectory', 'sources',
      '--minUptime', '2000', '--spinSleepTime', '5000',
      'bin/program.js'],
    {resolveLocalBin: true});
};
