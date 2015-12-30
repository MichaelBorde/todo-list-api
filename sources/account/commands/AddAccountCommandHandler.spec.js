'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var ConflictingEntityError = require('@arpinum/backend').ConflictingEntityError;
var CommandBus = require('@arpinum/backend').CommandBus;
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var AddAccountCommandHandler = require('./AddAccountCommandHandler');
var constants = require('../../test/constants');

describe('The add account command handler', function () {
  var handler;
  var repositories;

  beforeEach(function () {
    repositories = {
      account: new MemoryRepository(),
      user: new MemoryRepository()
    };
    handler = new AddAccountCommandHandler(
      repositories,
      new CommandBus()
    );
  });

  it('should create account and return the id', function () {
    var account = createAccount();

    return handler.run(account).then(function (withAccountId) {
      withAccountId.id.should.match(constants.UUID_REGEX);
      repositories.account.all().should.have.lengthOf(1);
      repositories.account.all()[0].id.should.equal(withAccountId.id);
    });
  });

  it('should validate account before creation', function () {
    var existingAccount = createAccount();
    repositories.account.with(existingAccount);

    return handler.run(existingAccount).should.be.rejectedWith(ConflictingEntityError);
  });

  function createAccount() {
    return {
      email: 'email',
      password: '123456'
    };
  }
});
