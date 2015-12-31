'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var validateCurrentAuthenticationCommandHandler = require('./validateCurrentAuthenticationCommandHandler');
var constants = require('../../test/constants');
var FunctionalError = require('@arpinum/backend').FunctionalError;

describe('The validate current authentication command handler', function () {
  var handler;
  var userRepository;

  beforeEach(function () {
    userRepository = new MemoryRepository();
    handler = validateCurrentAuthenticationCommandHandler({user: userRepository});
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
});
