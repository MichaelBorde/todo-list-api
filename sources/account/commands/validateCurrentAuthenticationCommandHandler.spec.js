'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var validateCurrentAuthenticationCommandHandler = require('./validateCurrentAuthenticationCommandHandler');
var constants = require('../../test/constants');
var FunctionalError = require('@arpinum/backend').FunctionalError;

describe('The validate current authentication command handler', function () {
  var handler;
  var accountRepository;

  beforeEach(function () {
    accountRepository = new MemoryRepository();
    handler = validateCurrentAuthenticationCommandHandler({account: accountRepository});
  });

  it('should validate successfully an authentication based on existing account', function () {
    accountRepository.with({email: constants.EMAIL});

    var promise = handler(constants.DECODED_JWT_TOKEN);

    return promise.should.eventually.be.fulfilled;
  });

  it('should reject if token is invalid', function () {
    accountRepository.with({email: constants.EMAIL});

    var promise = handler({email: 'invalid'});

    return promise.should.eventually.be.rejectedWith(FunctionalError, 'Invalid account');
  });

  it('should reject if account is unknown', function () {
    var promise = handler(constants.DECODED_JWT_TOKEN);

    return promise.should.eventually.be.rejectedWith(FunctionalError, 'Invalid account');
  });
});
