'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var findUserCommandHandler = require('./findUserCommandHandler');

describe('The find user command handler', function () {
  var handler;
  var userRepository;

  beforeEach(function () {
    userRepository = new MemoryRepository();
    handler = findUserCommandHandler({user: userRepository});
  });

  it('should find a user', function () {
    var users = [{id: '1', name: 'a user'}, {id: '2', name: 'another user'}];
    userRepository.withAll(users);

    return handler({id: '2'}).then(function (foundUser) {
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

    return handler({id: '1'}).then(function (foundUser) {
      foundUser.should.deep.equal({id: '1', name: 'a user'});
    });
  });
});
