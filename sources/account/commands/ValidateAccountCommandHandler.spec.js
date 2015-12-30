'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var ValidateAccountCommandHandler = require('./ValidateAccountCommandHandler');

describe('The validate account command handler', function () {
  var handler;
  var repositories;

  beforeEach(function () {
    repositories = {
      account: new MemoryRepository()
    };
    handler = new ValidateAccountCommandHandler(repositories, new CommandBus());
  });

  it('should validate successfully a new account', function () {
    var count = {email: 'email'};

    return handler.run(count).then(function (result) {
      result.should.deep.equal({valid: true});
    });
  });
});
