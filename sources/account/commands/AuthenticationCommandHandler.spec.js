'use strict';

require('chai').should();
var FunctionalError = require('@arpinum/backend').FunctionalError;
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var AuthenticationCommandHandler = require('./AuthenticationCommandHandler');
var constants = require('../../test/constants');

describe('The authentication command handler', function () {
  var handler;
  var accountRepository;

  beforeEach(function () {
    accountRepository = new MemoryRepository();
    handler = new AuthenticationCommandHandler(
      {account: accountRepository},
      new CommandBus()
    );
  });

  it('should return the authenticated accound if email and password are valid', function () {
    accountRepository.with({email: 'michael@mail.fr', password: constants.PASSWORD_IN_BCRYPT});

    var promise = handler.run({email: constants.EMAIL, password: constants.PASSWORD});

    return promise.then(function (count) {
      count.should.deep.equal({email: constants.EMAIL});
    });
  });

  it('should reject if account is unknown', function () {
    var promise = handler.run('unknown', constants.PASSWORD);

    return promise.should.be.rejectedWith(FunctionalError, 'Authentication failed');
  });
});
