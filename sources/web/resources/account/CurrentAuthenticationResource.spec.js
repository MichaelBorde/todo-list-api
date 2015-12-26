'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var FakeResponse = require('@arpinum/backend').FakeResponse;
var CurrentAuthenticationResource = require('./CurrentAuthenticationResource');
var constants = require('../../../test/constants');

describe('The authentication resource', function () {
  var resource;

  beforeEach(function () {
    resource = new CurrentAuthenticationResource();
  });

  context('during GET', function () {
    it('should send current authentication if authentication is provided', function () {
      var authentication = constants.DECODED_JWT_TOKEN;
      var request = {context: {authentication: authentication}};
      var response = new FakeResponse();

      resource.get(request, response);

      response.send.should.have.been.calledWith(authentication);
    });

    it('should send an empty response if authentication is missing', function () {
      var request = {context: {}};
      var response = new FakeResponse();

      resource.get(request, response);

      response.end.should.have.been.called;
    });
  });

  context('during DELETE', function () {
    it('should broadcast on the bus and delete the cookie and then end the response', function () {
      var authentication = constants.DECODED_JWT_TOKEN;
      var request = {context: {authentication: authentication}};
      var response = new FakeResponse();

      resource.delete(request, response);

      response.clearCookie.should.have.been.calledWith('jwtToken');
      response.end.should.have.been.called;
    });
  });
});
