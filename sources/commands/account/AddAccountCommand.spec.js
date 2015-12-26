'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var ConflictingEntityError = require('@arpinum/backend').ConflictingEntityError;
var CommandBus = require('@arpinum/backend').CommandBus;
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var AddAccountCommand = require('./AddAccountCommand');
var constants = require('../../test/constants');

describe('The add account command', function () {
  var command;
  var repositories;

  beforeEach(function () {
    repositories = {
      account: new MemoryRepository(),
      user: new MemoryRepository()
    };
    command = new AddAccountCommand(
      repositories,
      new CommandBus()
    );
  });

  it('should create account and return the id', function () {
    var account = createAccount();

    return command.run(account).then(function (withAccountId) {
      withAccountId.id.should.match(constants.UUID_REGEX);
      repositories.account.tous().should.have.lengthOf(1);
      repositories.account.tous()[0].id.should.equal(withAccountId.id);
    });
  });

  it('should validate account before creation', function () {
    var existingAccount = createAccount();
    repositories.account.with(existingAccount);

    return command.run(existingAccount).should.be.rejectedWith(ConflictingEntityError);
  });

  function createAccount() {
    return {
      email: 'email',
      password: '123456'
    };
  }
});
