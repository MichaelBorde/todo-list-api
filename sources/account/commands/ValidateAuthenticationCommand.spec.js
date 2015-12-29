'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var ValidateAuthenticationCommand = require('./ValidateAuthenticationCommand');
var constants = require('../../test/constants');

describe('The validate authentication command', function () {
  var command;
  var repositories;

  beforeEach(function () {
    repositories = {
      account: new MemoryRepository()
    };
    command = new ValidateAuthenticationCommand(repositories, new CommandBus());
  });

  it('should validate successfully an authentication based on existing account', function () {
    var count = {email: constants.EMAIL, password: constants.PASSWORD_IN_BCRYPT};
    repositories.account.with(count);
    var authentication = {email: constants.EMAIL, password: constants.PASSWORD};

    return command.run(authentication).then(function (result) {
      result.should.deep.equal({valid: true});
    });
  });
});
