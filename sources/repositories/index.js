'use strict';

var _ = require('lodash');
var glob = require('glob');
var path = require('path');

function Repositories(database) {
  var self = this;
  var modules = glob.sync(__dirname + '/**/*Repository.js');
  _.forEach(modules, function (module) {
    var key = _.camelCase(path.basename(module).replace('Repository.js', ''));
    self[key] = new (require(module))(database);
  });
}

module.exports = Repositories;
