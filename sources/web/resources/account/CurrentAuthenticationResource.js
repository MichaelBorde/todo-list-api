'use strict';

var log = require('../../../tools/log')(__filename);

function CurrentAuthenticationResource() {
  var self = this;
  self.get = get;
  self.delete = doDelete;

  function get(request, response) {
    if (!request.context.authentication) {
      log.debug('User is not authenticated');
      response.end();
    } else {
      log.debug('User is authenticated', request.context.authentication);
      response.send(request.context.authentication);
    }
  }

  function doDelete(request, response) {
    response.clearCookie('jwtToken');
    response.end();
  }
}

module.exports = CurrentAuthenticationResource;
