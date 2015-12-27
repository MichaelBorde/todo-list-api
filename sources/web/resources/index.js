'use strict';

var _ = require('lodash');
var glob = require('glob');
var path = require('path');

function Resources(commandBus) {
  var self = this;
  var modules = glob.sync(__dirname + '/**/*Resource.js');
  _.forEach(modules, function (module) {
    var key = _.camelCase(path.basename(module).replace('Resource.js', ''));
    self[key] = new (require(module))(commandBus);
  });
}

module.exports = Resources;
