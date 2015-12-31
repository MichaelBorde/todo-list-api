'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var validateauthenticationCommandHandler = require('./validateauthenticationCommandHandler');
var constants = require('../../test/constants');

describe('The validate authentication command handler', function () {
  var handler;
  var repositories;

  beforeEach(function () {
    repositories = {
      user: new MemoryRepository()
    };
    handler = validateauthenticationCommandHandler(repositories);
  });

  it('should validate successfully an authentication based on existing user', function () {
    var count = {email: constants.EMAIL, password: constants.PASSWORD_IN_BCRYPT};
    repositories.user.with(count);
    var authentication = {email: constants.EMAIL, password: constants.PASSWORD};

    return handler(authentication).then(function (result) {
      result.should.deep.equal({valid: true});
    });
  });
});
