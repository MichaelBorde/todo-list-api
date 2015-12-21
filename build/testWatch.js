'use strict';

var watch = require('watch');

module.exports = function (cluck) {
  var running = false;
  watch.watchTree('sources', onModified);

  function onModified() {
    if (!running) {
      running = true;
      cluck.tasks.run('test')
        .catch(function (error) {
          if (error) {
            cluck.log.error(error);
          }
        })
        .finally(function () {
          running = false;
        });
    }
  }
};
