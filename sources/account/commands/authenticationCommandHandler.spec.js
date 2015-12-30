'use strict';

require('chai').should();
var FunctionalError = require('@arpinum/backend').FunctionalError;
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var authenticationCommandHandler = require('./authenticationCommandHandler');
var constants = require('../../test/constants');

describe('The authentication command handler', function () {
  var handler;
  var accountRepository;

  beforeEach(function () {
    accountRepository = new MemoryRepository();
    handler = authenticationCommandHandler({account: accountRepository});
  });

  it('should return the authenticated accound if email and password are valid', function () {
    accountRepository.with({email: 'michael@mail.fr', password: constants.PASSWORD_IN_BCRYPT});

    var promise = handler({email: constants.EMAIL, password: constants.PASSWORD});

    return promise.then(function (count) {
      count.should.deep.equal({email: constants.EMAIL});
    });
  });

  it('should reject if account is unknown', function () {
    var promise = handler('unknown', constants.PASSWORD);

    return promise.should.be.rejectedWith(FunctionalError, 'Authentication failed');
  });
});
