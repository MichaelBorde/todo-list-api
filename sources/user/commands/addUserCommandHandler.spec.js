'use strict';

require('chai').should();
var sinon = require('sinon');
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var addUserCommandHandler = require('./addUserCommandHandler');

describe('The add user command handler', function () {
  var handler;
  var userRepository;
  var eventBus;

  beforeEach(function () {
    userRepository = new MemoryRepository();
    eventBus = {broadcast: sinon.stub()};
    handler = addUserCommandHandler({user: userRepository}, {event: eventBus});
  });

  it('should add a new user', function () {
    var newUser = {id: '1', email: 'email'};

    return handler(newUser).then(function () {
      userRepository.all().should.deep.equal([newUser]);
    });
  });

  it('should broadcast an event after the creation', function () {
    var newUser = {id: '1', email: 'email'};

    return handler(newUser).then(function () {
      eventBus.broadcast.should.have.been.calledWith('userAddedEvent', newUser);
    });
  });
});
