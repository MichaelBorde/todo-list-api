'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var sinon = require('sinon');
var _ = require('lodash');
var Bluebird = require('bluebird');
var CommandBus = require('@arpinum/backend').CommandBus;
var FakeResponse = require('@arpinum/backend').FakeResponse;
var AuthenticationsResource = require('./AuthenticationsResource');
var configuration = require('../../configuration');
var constants = require('../../test/constants');

describe('The authentications resource', function () {
  var resource;
  var commandBus;
  var log;

  beforeEach(function () {
    commandBus = new CommandBus();
    log = {warn: sinon.stub()};
    resource = new AuthenticationsResource(commandBus, {log: log});
  });

  context('during POST', function () {
    it('should broadcast on the command bus and respond with a cookie', function () {
      var authentication = {email: constants.EMAIL, password: '123456', toRemember: true};
      commandBus.register('authenticationCommand', function (auth) {
        if (!_.isEqual(auth, authentication)) {
          return Bluebird.reject('Wrong authentication');
        }
        return Bluebird.resolve({email: constants.EMAIL});
      });
      var response = new FakeResponse();

      return resource.post({body: authentication}, response).then(function () {
        var argumentsCookie = response.cookie.lastCall.args;
        argumentsCookie.should.have.lengthOf(3);
        argumentsCookie[0].should.equal('jwtToken');
        argumentsCookie[1].should.match(constants.JWT_REGEX);
        argumentsCookie[2].should.deep.equal({
          httpOnly: true,
          secure: configuration.securedCookie,
          maxAge: configuration.authenticationExpirationInMinutes * 1000 * 60
        });
        response.end.should.have.been.called;
      });
    });

    it('should respond with a session cookie if authentication must not be remembered', function () {
      var authentication = {email: constants.EMAIL, password: '123456', toRemember: false};
      commandBus.register('authenticationCommand', function () {
        return Bluebird.resolve({email: constants.EMAIL});
      });
      var response = new FakeResponse();

      return resource.post({body: authentication}, response).then(function () {
        var argumentsCookie = response.cookie.lastCall.args;
        argumentsCookie[2].should.deep.equal({
          httpOnly: true,
          secure: configuration.securedCookie,
          expires: 0
        });
      });
    });

    it('should respond with errors if authentication is incomplete', function () {
      commandBus.register('authenticationCommand', function () {
        return Bluebird.resolve('should not be called');
      });
      var response = new FakeResponse();

      var promise = resource.post({body: {}}, response);
      return promise.should.be.rejected.then(function (error) {
        error.should.be.defined;
        error.code.should.equal(401);
        error.message.should.equal(
          'Invalid authentication: ' +
          'email is mandatory, ' +
          'password is mandatory');
      });
    });
  });
});
