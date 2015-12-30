'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var validateAccountCommandHandler = require('./validateAccountCommandHandler');

describe('The validate account command handler', function () {
  var handler;
  var repositories;

  beforeEach(function () {
    repositories = {
      account: new MemoryRepository()
    };
    handler = validateAccountCommandHandler(repositories);
  });

  it('should validate successfully a new account', function () {
    var count = {email: 'email'};

    return handler(count).then(function (result) {
      result.should.deep.equal({valid: true});
    });
  });
});
