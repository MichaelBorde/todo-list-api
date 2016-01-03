'use strict';

var should = require('chai').should();
var repositoryInMemory = require('@arpinum/backend').repositoryInMemory;
var UserRepository = require('./UserRepository');
var AuthenticationValidator = require('./AuthenticationValidator');
var constants = require('../test/constants');

describe('The authentication validator', function () {

  var validator;
  var repositories;

  beforeEach(function () {
    repositories = {user: repositoryInMemory(UserRepository)};
    validator = new AuthenticationValidator(repositories);
  });

  it('should validate successfully an existing user with a valid password', function () {
    var existingUser = {email: constants.EMAIL, password: constants.PASSWORD_IN_BCRYPT};
    repositories.user.with(existingUser);
    var userToValidate = {email: constants.EMAIL, password: constants.PASSWORD};

    return validator.validate(userToValidate).then(function (validation) {
      validation.valid.should.be.true;
      should.not.exist(validation.errors);
    });
  });

  it('should validate with failure if user is unknown', function () {
    var userToValidate = {email: constants.EMAIL, password: constants.PASSWORD};

    return validator.validate(userToValidate).then(function (validation) {
      validation.valid.should.be.false;
      validation.errors.should.deep.equal(['User_NOT_FOUND']);
    });
  });

  it('should validate with failure if password is wrong', function () {
    var existingUser = {email: constants.EMAIL, password: constants.PASSWORD_IN_BCRYPT};
    repositories.user.with(existingUser);
    var userToValidate = {email: constants.EMAIL, password: 'wrong'};

    return validator.validate(userToValidate).then(function (validation) {
      validation.valid.should.be.false;
      validation.errors.should.deep.equal(['WRONG_PASSWORD']);
    });
  });
});
