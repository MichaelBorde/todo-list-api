'use strict';

var should = require('chai').should();
var AuthenticationValidator = require('./AuthenticationValidator');
var MemoryRepository = require('../../test/MemoryRepository');
var constants = require('../../test/constants');

describe('The authentication validator', function () {
  var validator;
  var repositories;

  beforeEach(function () {
    repositories = {
      account: new MemoryRepository()
    };
    validator = new AuthenticationValidator(repositories);
  });

  it('should validate successfully an existing account with a valid password', function () {
    var existingAccount = {email: constants.EMAIL, password: constants.PASSWORD_IN_BCRYPT};
    repositories.account.with(existingAccount);
    var accountToValidate = {email: constants.EMAIL, password: constants.PASSWORD};

    return validator.validate(accountToValidate).then(function (validation) {
      validation.valid.should.be.true;
      should.not.exist(validation.errors);
    });
  });

  it('should validate with failure if account is unknown', function () {
    var accountToValidate = {email: constants.EMAIL, password: constants.PASSWORD};

    return validator.validate(accountToValidate).then(function (validation) {
      validation.valid.should.be.false;
      validation.errors.should.deep.equal(['ACCOUNT_NOT_FOUND']);
    });
  });

  it('should validate with failure if password is wrong', function () {
    var existingAccount = {email: constants.EMAIL, password: constants.PASSWORD_IN_BCRYPT};
    repositories.account.with(existingAccount);
    var accountToValidate = {email: constants.EMAIL, password: 'wrong'};

    return validator.validate(accountToValidate).then(function (validation) {
      validation.valid.should.be.false;
      validation.errors.should.deep.equal(['WRONG_PASSWORD']);
    });
  });
});
