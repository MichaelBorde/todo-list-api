'use strict';

require('chai').use(require('chai-as-promised')).should();
var AddAccountCommand = require('./AddAccountCommand');
var MemoryRepository = require('../../test/MemoryRepository');
var CommandBus = require('../../tools/CommandBus');
var constants = require('../../test/constants');
var errors = require('../../domain/errors');

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

    return command.run(existingAccount).should.be.rejectedWith(errors.ConflictingEntityError);
  });

  function createAccount() {
    return {
      email: 'email',
      password: '123456'
    };
  }
});
