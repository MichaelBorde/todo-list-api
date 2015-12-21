'use strict';

require('chai').use(require('chai-as-promised')).should();
var ValidateAccountCommand = require('./ValidateAccountCommand');
var MemoryRepository = require('../../test/MemoryRepository');
var CommandBus = require('../../tools/CommandBus');

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
