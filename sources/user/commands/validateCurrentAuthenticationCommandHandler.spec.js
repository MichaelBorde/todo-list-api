'use strict';

require('chai').should();
var sinon = require('sinon');
var repositoryInMemory = require('@arpinum/backend').repositoryInMemory;
var UserRepository = require('../UserRepository');
var validateCurrentAuthenticationCommandHandler = require('./validateCurrentAuthenticationCommandHandler');
var constants = require('../../test/constants');
var FunctionalError = require('@arpinum/backend').FunctionalError;

describe('The validate current authentication command handler', function () {
  var handler;
  var userRepository;
  var eventBus;

  beforeEach(function () {
    userRepository = repositoryInMemory(UserRepository);
    eventBus = {broadcast: sinon.stub()};
    handler = validateCurrentAuthenticationCommandHandler({user: userRepository}, {event: eventBus});
  });

  it('should validate successfully an authentication based on existing user', function () {
    userRepository.with({email: constants.EMAIL});

    var promise = handler(constants.DECODED_JWT_TOKEN);

    return promise.should.eventually.be.fulfilled;
  });

  it('should reject if token is invalid', function () {
    userRepository.with({email: constants.EMAIL});

    var promise = handler({email: 'invalid'});

    return promise.should.eventually.be.rejectedWith(FunctionalError, 'Invalid user');
  });

  it('should reject if user is unknown', function () {
    var promise = handler(constants.DECODED_JWT_TOKEN);

    return promise.should.eventually.be.rejectedWith(FunctionalError, 'Invalid user');
  });

  it('should broadcast an event after the validation', function () {
    userRepository.with({email: constants.EMAIL});

    var promise = handler(constants.DECODED_JWT_TOKEN);

    return promise.then(function () {
      eventBus.broadcast.should.have.been.calledWith('authenticationValidated', {email: constants.EMAIL});
    });
  });
});
