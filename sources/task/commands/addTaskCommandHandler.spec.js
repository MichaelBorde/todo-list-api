'use strict';

require('chai').should();
var sinon = require('sinon');
var repositoryInMemory = require('@arpinum/backend').repositoryInMemory;
var TaskRepository = require('../TaskRepository');
var addTaskCommandHandler = require('./addTaskCommandHandler');

describe('The add task command handler', function () {
  var handler;
  var taskRepository;
  var eventBus;

  beforeEach(function () {
    taskRepository = repositoryInMemory(TaskRepository);
    eventBus = {broadcast: sinon.stub()};
    handler = addTaskCommandHandler({task: taskRepository}, {event: eventBus});
  });

  it('should add a new task', function () {
    var command = {id: '1', title: 'the title'};

    return handler(command).then(function () {
      taskRepository.all().should.deep.equal([command]);
    });
  });

  it('should broadcast an event after the creation', function () {
    var command = {id: '1', title: 'the title'};

    return handler(command).then(function () {
      eventBus.broadcast.should.have.been.calledWith('taskAddedEvent', command);
    });
  });
});
