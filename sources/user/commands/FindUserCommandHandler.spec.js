'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var FindUserCommandHandler = require('./FindUserCommandHandler');

describe('The find user command handler', function () {
  var handler;
  var userRepository;

  beforeEach(function () {
    userRepository = new MemoryRepository();
    handler = new FindUserCommandHandler(
      {user: userRepository},
      new CommandBus()
    );
  });

  it('should find a user', function () {
    var users = [{id: '1', name: 'a user'}, {id: '2', name: 'another user'}];
    userRepository.withAll(users);

    return handler.run({id: '2'}).then(function (foundUser) {
      foundUser.should.deep.equal({id: '2', name: 'another user'});
    });
  });

  it('should never return the password', function () {
    var users = [{
      id: '1',
      name: 'a user',
      password: 'bleh'
    }];
    userRepository.withAll(users);

    return handler.run({id: '1'}).then(function (foundUser) {
      foundUser.should.deep.equal({id: '1', name: 'a user'});
    });
  });
});
