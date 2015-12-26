'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var ValidateAccountCommand = require('./ValidateAccountCommand');

describe('The validate account command', function () {
  var command;
  var repositories;

  beforeEach(function () {
    repositories = {
      account: new MemoryRepository()
    };
    command = new ValidateAccountCommand(repositories, new CommandBus());
  });

  it('should validate successfully a new account', function () {
    var count = {email: 'email'};

    return command.run(count).then(function (result) {
      result.should.deep.equal({valid: true});
    });
  });
});
