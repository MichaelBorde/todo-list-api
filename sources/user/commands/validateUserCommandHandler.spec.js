'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var validateUserCommandHandler = require('./validateUserCommandHandler');

describe('The validate user command handler', function () {
  var handler;
  var repositories;

  beforeEach(function () {
    repositories = {
      user: new MemoryRepository()
    };
    handler = validateUserCommandHandler(repositories);
  });

  it('should validate successfully a new user', function () {
    var count = {email: 'email'};

    return handler(count).then(function (result) {
      result.should.deep.equal({valid: true});
    });
  });
});
