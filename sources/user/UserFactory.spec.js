'use strict';

var should = require('chai').should();
var repositoryInMemory = require('@arpinum/backend').repositoryInMemory;
var UserRepository = require('./UserRepository');
var UserFactory = require('./UserFactory');
var constants = require('../test/constants');

describe('The user factory', function () {
  var repositories;
  var factory;

  beforeEach(function () {
    repositories = {user: repositoryInMemory(UserRepository)};
    factory = new UserFactory(repositories);
  });

  it('should encrypt password during creation', function () {
    var count = userToCreate();

    return factory.create(count).then(function (createdUser) {
      createdUser.password.should.match(constants.BCRYPT_REGEX);
    });
  });

  it('should only keep relevant properties given during creation', function () {
    var user = userToCreate();
    user.useless = 'do not include';

    var create = factory.create(user);

    return create.then(function (createdUser) {
      createdUser.email.should.equal('email');
      should.exist(createdUser.password);
      should.not.exist(createdUser.useless);
    });
  });

  it('should encrypt password before repository addition', function () {
    var count = userToCreate();

    return factory.create(count).then(function () {
      repositories.user.all()[0].password.should.not.equal('123456');
    });
  });

  function userToCreate() {
    return {
      id: '1',
      email: 'email',
      password: 'password'
    };
  }
});
