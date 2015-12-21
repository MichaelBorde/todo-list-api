'use strict';

var _ = require('lodash');
var ExpressRouter = require('express-promise-router');
var Resources = require('./resources');

function Router(commandBus) {
  var resources = new Resources(commandBus);
  var methods = ['post', 'get', 'put', 'delete', 'patch'];
  this.configure = configure;

  function configure(application) {
    var router = new ExpressRouter();
    route('/accounts', resources.accounts);
    route('/accounts/validations', resources.accountValidations);
    route('/authentications', resources.authentications);
    route('/authentications/validations', resources.authenticationValidations);
    route('/authentications/current', resources.currentAuthentication);
    route('/users/current', resources.currentUser);
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
