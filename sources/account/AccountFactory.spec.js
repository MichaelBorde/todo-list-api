'use strict';

var should = require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var AccountFactory = require('./AccountFactory');
var constants = require('../test/constants');

describe('The account factory', function () {
  var repositories;
  var factory;

  beforeEach(function () {
    repositories = {
      account: new MemoryRepository()
    };
    factory = new AccountFactory(repositories);
  });

  it('should encrypt password during creation', function () {
    var count = accountToCreate();

    return factory.create(count).then(function (createdAccount) {
      createdAccount.password.should.match(constants.BCRYPT_REGEX);
    });
  });

  it('should only keep relevant properties given during creation', function () {
    var account = accountToCreate();
    account.useless = 'do not include';

    var create = factory.create(account);

    return create.then(function (createdAccount) {
      createdAccount.email.should.equal('email');
      should.exist(createdAccount.password);
      should.not.exist(createdAccount.useless);
    });
  });

  it('should encrypt password before repository addition', function () {
    var count = accountToCreate();

    return factory.create(count).then(function () {
      repositories.account.all()[0].password.should.not.equal('123456');
    });
  });

  function accountToCreate() {
    return {
      id: '1',
      email: 'email',
      password: 'password'
    };
  }
});
