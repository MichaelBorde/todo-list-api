'use strict';

require('chai').should();
var ValidateCurrentAuthenticationCommand = require('./ValidateCurrentAuthenticationCommand');
var MemoryRepository = require('../../test/MemoryRepository');
var CommandBus = require('../../tools/CommandBus');
var constants = require('../../test/constants');
var FunctionalError = require('../../tools/errors/FunctionalError');

describe('The validate current authentication command', function () {
  var command;
  var accountRepository;

  beforeEach(function () {
    accountRepository = new MemoryRepository();
    command = new ValidateCurrentAuthenticationCommand(
      {account: accountRepository},
      new CommandBus()
    );
  });

  it('should validate successfully an authentication based on existing account', function () {
    accountRepository.with({email: constants.EMAIL});

    var promise = command.run(constants.DECODED_JWT_TOKEN);

    return promise.should.eventually.be.fulfilled;
  });

  it('should reject if token is invalid', function () {
    accountRepository.with({email: constants.EMAIL});

    var promise = command.run({email: 'invalid'});

    return promise.should.eventually.be.rejectedWith(FunctionalError, 'Invalid account');
  });

  it('should reject if account is unknown', function () {
    var promise = command.run(constants.DECODED_JWT_TOKEN);

    return promise.should.eventually.be.rejectedWith(FunctionalError, 'Invalid account');
  });
});
