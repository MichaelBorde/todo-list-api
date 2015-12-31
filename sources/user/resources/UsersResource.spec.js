'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var _ = require('lodash');
var Bluebird = require('bluebird');
var sinon = require('sinon');
var rewire = require('rewire');
var FakeResponse = require('@arpinum/backend').FakeResponse;
var constants = require('../../test/constants');
var UsersResource = rewire('./UsersResource');

describe('The users resource', function () {
  var resource;
  var commandBus;

  beforeEach(function () {
    commandBus = {broadcast: sinon.stub().returns(Bluebird.resolve())};

    UsersResource.__set__({
      uuid: {create: _.constant('1337')}
    });

    resource = new UsersResource({command: commandBus});
  });

  context('during POST', function () {
    it('should broadcast on the command bus and resolve created data', function () {
      var user = {
        email: constants.EMAIL,
        password: constants.PASSWORD
      };
      var request = {
        body: user
      };
      var response = new FakeResponse();

      var post = resource.post(request, response);

      return post.then(function () {
        var expectedCommand = {
          id: '1337',
          email: constants.EMAIL,
          password: constants.PASSWORD
        };
        commandBus.broadcast.should.have.been.calledWith('addUserCommand', expectedCommand);
        response.send.should.have.been.calledWith({id: '1337'});
      });
    });

    it('should reject with errors if user is invalid', function () {
      var response = new FakeResponse();
      var request = {body: {}};

      var promise = resource.post(request, response);

      return promise.should.be.rejected.then(function (error) {
        commandBus.broadcast.should.not.have.been.called;
        error.should.be.defined;
        error.code.should.equal(400);
        error.message.should.equal(
          'Invalid user: ' +
          'email is mandatory, ' +
          'password is mandatory');
      });
    });
  });
});
