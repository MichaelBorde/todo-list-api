'use strict';

var should = require('chai').should();
var Bluebird = require('bluebird');
var AccountFactory = require('./AccountFactory');
var MemoryRepository = require('../../test/MemoryRepository');
var constants = require('../../test/constants');

describe('The account factory', function () {
  var repositories;
  var factory;

  beforeEach(function () {
    repositories = {
      account: new MemoryRepository(),
      user: new MemoryRepository(),
      invitations: new MemoryRepository()
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
    var count = accountToCreate();
    count.useless = 'do not include';

    return factory.create(count).then(function (createdAccount) {
      createdAccount.email.should.equal('email');
      should.exist(createdAccount.password);
      should.not.exist(createdAccount.useless);
    });
  });

  it('should encrypt password before repository addition', function () {
    var count = accountToCreate();

    return factory.create(count).then(function () {
      repositories.account.tous()[0].password.should.not.equal('123456');
    });
  });

  it('should add a user to repository with the same email as the account one', function () {
    var count = accountToCreate();

    return factory.create(count).then(function () {
      repositories.user.tous().should.have.lengthOf(1);
      repositories.user.tous()[0].email.should.equal('email');
    });
  });

  it('wont keep any data if the account creation fails', function () {
    repositories.account.add = function () {
      return Bluebird.reject('bleh');
    };
    var count = accountToCreate();

    var promise = factory.create(count);

    return promise.should.be.rejected.then(function () {
      repositories.account.tous().should.be.empty;
      repositories.user.tous().should.be.empty;
    });
  });

  it('wont keep any data if the user creation fails', function () {
    repositories.user.add = function () {
      return Bluebird.reject('bleh');
    };
    var count = accountToCreate();

    var promise = factory.create(count);

    return promise.should.be.rejected.then(function () {
      repositories.account.tous().should.be.empty;
      repositories.user.tous().should.be.empty;
    });
  });

  function accountToCreate() {
    return {
      email: 'email',
      password: 'password'
    };
  }
});
