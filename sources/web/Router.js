'use strict';

var _ = require('lodash');
var ExpressRouter = require('express-promise-router');

function Router(resources) {
  var methods = ['post', 'get', 'put', 'delete', 'patch'];
  this.configure = configure;

  function configure(application) {
    var router = new ExpressRouter();
    route('/users', resources.users);
    route('/users/current', resources.currentUser);
    route('/authentications', resources.authentications);
    route('/authentications/current', resources.currentAuthentication);
    route('/tasks', resources.tasks);
    route('/tasks/:id', resources.task);

    application.use(router);

    function route(url, ressource) {
      _.forEach(methods, function (method) {
        if (ressource[method]) {
          router[method](url, ressource[method]);
        }
      });
    }
  }
}

module.exports = Router;
