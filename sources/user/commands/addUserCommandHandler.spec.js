'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var sinon = require('sinon');
var ConflictingEntityError = require('@arpinum/backend').ConflictingEntityError;
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var addUserCommandHandler = require('./addUserCommandHandler');
var constants = require('../../test/constants');

describe('The add user command handler', function () {
  var handler;
  var repositories;
  var eventBus;

  beforeEach(function () {
    repositories = {user: new MemoryRepository()};
    eventBus = {broadcast: sinon.stub()};
    handler = addUserCommandHandler(repositories, {event: eventBus});
  });

  it('should add a new user', function () {
    var command = createUserCommand();

    var promise = handler(command);

    return promise.then(function () {
      repositories.user.all().should.have.lengthOf(1);
      repositories.user.all()[0].id.should.equal('1');
    });
  });

  it('should broadcast an event after the creation', function () {
    var command = createUserCommand();

    var promise = handler(command);

    return promise.then(function () {
      eventBus.broadcast.should.have.been.called;
      eventBus.broadcast.lastCall.args[0].should.equal('userAddedEvent');
      eventBus.broadcast.lastCall.args[1].id.should.equal('1');
      eventBus.broadcast.lastCall.args[1].email.should.equal('email');
    });
  });

  it('should validate user before creation', function () {
    var existingUser = createUserCommand();
    repositories.user.with(existingUser);

    return handler(existingUser).should.be.rejectedWith(ConflictingEntityError);
  });

  function createUserCommand() {
    return {
      id: '1',
      email: 'email',
      password: constants.PASSWORD
    };
  }
});
