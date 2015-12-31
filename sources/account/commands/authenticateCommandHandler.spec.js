'use strict';

require('chai').should();
var sinon = require('sinon');
var FunctionalError = require('@arpinum/backend').FunctionalError;
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var authenticateCommandHandler = require('./authenticateCommandHandler');
var constants = require('../../test/constants');

describe('The authenticate command handler', function () {
  var handler;
  var accountRepository;
  var eventBus;

  beforeEach(function () {
    accountRepository = new MemoryRepository();
    eventBus = {broadcast: sinon.stub()};
    handler = authenticateCommandHandler({account: accountRepository}, {event: eventBus});
  });

  it('should succeed if email and password are valid', function () {
    accountRepository.with({email: 'michael@mail.fr', password: constants.PASSWORD_IN_BCRYPT});

    var promise = handler({email: constants.EMAIL, password: constants.PASSWORD});

    return promise.should.eventually.be.fulfilled;
  });

  it('should broadcast an event after the authentification', function () {
    accountRepository.with({email: 'michael@mail.fr', password: constants.PASSWORD_IN_BCRYPT});
    var command = {email: constants.EMAIL, password: constants.PASSWORD};

    var promise = handler(command);

    return promise.then(function () {
      eventBus.broadcast.should.have.been.calledWith('userAuthenticated', {email: constants.EMAIL});
    });
  });

  it('should reject if account is unknown', function () {
    var promise = handler('unknown', constants.PASSWORD);

    return promise.should.be.rejectedWith(FunctionalError, 'Authentication failed');
  });
});
