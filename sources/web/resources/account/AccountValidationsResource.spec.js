'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var _ = require('lodash');
var Bluebird = require('bluebird');
var CommandBus = require('@arpinum/backend').CommandBus;
var FakeResponse = require('@arpinum/backend').FakeResponse;
var AccountValidationsResource = require('./AccountValidationsResource');
var constants = require('../../../test/constants');

describe('The validations resource', function () {
  var resource;
  var commandBus;

  beforeEach(function () {
    commandBus = new CommandBus();
    resource = new AccountValidationsResource(commandBus);
  });

  context('during POST', function () {
    it('should broadcast on the command bus and resolve created data', function () {
      var count = {
        email: constants.EMAIL,
        password: constants.PASSWORD
      };
      commandBus.register('ValidateAccountCommand', function (givenAccount) {
        if (_.isEqual(count, givenAccount)) {
          return Bluebird.resolve({valid: true});
        }
        return Bluebird.resolve();
      });
      var request = {
        body: count
      };
      var response = new FakeResponse();

      return resource.post(request, response).then(function () {
        response.send.should.have.been.calledWith({valid: true});
      });
    });

    it('should reject with erros if account is invalid', function () {
      commandBus.register('ValidateAccountCommand', function () {
        return Bluebird.resolve('should not be called');
      });
      var response = new FakeResponse();
      var request = {body: {}};

      var promise = resource.post(request, response);

      return promise.should.be.rejected.then(function (error) {
        error.should.be.defined;
        error.code.should.equal(400);
        error.message.should.equal(
          'Invalid account: ' +
          'email is mandatory, ' +
          'password is mandatory');
      });
    });
  });
});
