'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var PasswordService = require('./PasswordService');
var constants = require('../../test/constants');

describe('The password service', function () {
  var service;

  beforeEach(function () {
    service = new PasswordService();
  });

  it('should compare successfully two corresponding passwords', function () {
    var count = {password: constants.PASSWORD_IN_BCRYPT};

    return service.compareWithAccount(constants.PASSWORD, count).should.eventually.be.true;
  });

  it('should compare with failure if passwords do not correspond', function () {
    var count = {password: constants.PASSWORD_IN_BCRYPT};

    return service.compareWithAccount('bleh', count).should.eventually.be.false;
  });

  it('should encrypt passwords', function () {
    return service.encrypt(constants.PASSWORD).should.eventually.match(constants.BCRYPT_REGEX);
  });

  it('should encrypt a password though it is empty', function () {
    return service.encrypt().should.eventually.match(constants.BCRYPT_REGEX);
  });
});
