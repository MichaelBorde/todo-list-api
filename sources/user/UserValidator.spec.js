'use strict';

var repositoryInMemory = require('@arpinum/backend').repositoryInMemory;
var UserRepository = require('./UserRepository');
var UserValidator = require('./UserValidator');

describe('The user validator', function () {
  var repositories;
  var validator;

  beforeEach(function () {
    repositories = {user: repositoryInMemory(UserRepository)};
    validator = new UserValidator(repositories);
  });

  it('should validate successfully if user is new', function () {
    var user = acountToCreate();

    return validator.validate(user).then(function (result) {
      result.should.deep.equal({valid: true});
    });
  });

  it('should validate with failure if user already exist', function () {
    var user = acountToCreate();
    repositories.user.with(user);

    return validator.validate(user).then(function (result) {
      result.should.deep.equal({
        valid: false,
        errors: ['EXISTING_EMAIL']
      });
    });
  });

  function acountToCreate() {
    return {
      email: 'email',
      password: 'the password'
    };
  }
});
