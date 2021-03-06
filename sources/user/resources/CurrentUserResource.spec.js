'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var FakeResponse = require('@arpinum/backend').FakeResponse;
var CurrentUserResource = require('./CurrentUserResource');
var constants = require('../../test/constants');

describe('The current user resource', function () {
  var resource;

  beforeEach(function () {
    resource = new CurrentUserResource();
  });

  context('during GET', function () {
    it('should send the current user put in the request', function () {
      var request = {context: {user: constants.USER}};
      var response = new FakeResponse();

      resource.get(request, response);

      response.send.should.have.been.calledWith(constants.USER);
    });
  });
});
