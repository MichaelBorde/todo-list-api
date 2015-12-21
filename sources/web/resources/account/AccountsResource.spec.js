'use strict';

require('chai').use(require('chai-as-promised')).should();
var _ = require('lodash');
var Bluebird = require('bluebird');
var AccountsResource = require('./AccountsResource');
var FakeResponse = require('../../../test/FakeResponse');
var CommandBus = require('../../../tools/CommandBus');
var constants = require('../../../test/constants');

describe('The accounts resource', function () {
  var resource;
  var commandBus;

  beforeEach(function () {
    commandBus = new CommandBus();
    resource = new AccountsResource(commandBus);
  });

  context('during POST', function () {
    it('should broadcast on the command bus and resolve created data', function () {
      var count = {
        email: constants.EMAIL,
        password: constants.PASSWORD
      };
      commandBus.register('AddAccountCommand', {
        run: function (givenAccount) {
          if (_.isEqual(count, givenAccount)) {
            return Bluebird.resolve({id: '1337'});
          }
          return Bluebird.resolve();
        }
      });
      var request = {
        body: count
      };
      var response = new FakeResponse();

      return resource.post(request, response).then(function () {
        response.send.should.have.been.calledWith({id: '1337'});
      });
    });

    it('should reject with errors if account is invalid', function () {
      commandBus.register('AddAccountCommand', {
        run: function () {
          return Bluebird.resolve('should not be called');
        }
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
