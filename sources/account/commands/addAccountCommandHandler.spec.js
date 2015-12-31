'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var sinon = require('sinon');
var ConflictingEntityError = require('@arpinum/backend').ConflictingEntityError;
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var addAccountCommandHandler = require('./addAccountCommandHandler');
var constants = require('../../test/constants');

describe('The add account command handler', function () {
  var handler;
  var repositories;
  var eventBus;

  beforeEach(function () {
    repositories = {account: new MemoryRepository()};
    eventBus = {broadcast: sinon.stub()};
    handler = addAccountCommandHandler(repositories, {event: eventBus});
  });

  it('should add a new account', function () {
    var command = createAccountCommand();

    var promise = handler(command);

    return promise.then(function () {
      repositories.account.all().should.have.lengthOf(1);
      repositories.account.all()[0].id.should.equal('1');
    });
  });

  it('should broadcast an event after the creation', function () {
    var command = createAccountCommand();

    var promise = handler(command);

    return promise.then(function () {
      eventBus.broadcast.should.have.been.called;
      eventBus.broadcast.lastCall.args[0].should.equal('accountAddedEvent');
      eventBus.broadcast.lastCall.args[1].id.should.equal('1');
      eventBus.broadcast.lastCall.args[1].email.should.equal('email');
    });
  });

  it('should validate account before creation', function () {
    var existingAccount = createAccountCommand();
    repositories.account.with(existingAccount);

    return handler(existingAccount).should.be.rejectedWith(ConflictingEntityError);
  });

  function createAccountCommand() {
    return {
      id: '1',
      email: 'email',
      password: constants.PASSWORD
    };
  }
});
