'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var FindUserCommand = require('./FindUserCommand');

describe('The find user command', function () {
  var command;
  var userRepository;

  beforeEach(function () {
    userRepository = new MemoryRepository();
    command = new FindUserCommand(
      {user: userRepository},
      new CommandBus()
    );
  });

  it('should find a user', function () {
    var users = [{id: '1', name: 'a user'}, {id: '2', name: 'another user'}];
    userRepository.withAll(users);

    return command.run({id: '2'}).then(function (foundUser) {
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

    return command.run({id: '1'}).then(function (foundUser) {
      foundUser.should.deep.equal({id: '1', name: 'a user'});
    });
  });
});
