'use strict';

module.exports = function (cluck) {
  cluck.findAndRegisterTasks('build/**/*.js');

  cluck.withTask('test').doing('noLog', 'mocha');
  cluck.withTask('tdd').doing('noLog', 'testWatch');
  cluck.withTask('live').doing('serverWatch');
  cluck.withTask('default').doing('eslint', 'test');
};
