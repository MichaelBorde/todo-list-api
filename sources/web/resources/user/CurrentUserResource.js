'use strict';

function CurrentUserResource() {
  this.get = get;

  function get(request, response) {
    response.send(request.context.user);
  }
}

module.exports = CurrentUserResource;
