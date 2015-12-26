'use strict';

var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var AccountValidator = require('./AccountValidator');

describe('The account validator', function () {
  var repositories;
  var validator;

  beforeEach(function () {
    repositories = {
      account: new MemoryRepository()
    };
    validator = new AccountValidator(repositories);
  });

  it('should validate successfully if account is new', function () {
    var account = acountToCreate();

    return validator.validate(account).then(function (result) {
      result.should.deep.equal({valid: true});
    });
  });

  it('should validate with failure if account already exist', function () {
    var account = acountToCreate();
    repositories.account.with(account);

    return validator.validate(account).then(function (result) {
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
